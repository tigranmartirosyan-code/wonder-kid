import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import  cookieParser from 'cookie-parser';
import hbs from 'hbs';
import dayjs from 'dayjs';
import * as bcrypt from 'bcrypt';

async function hashPassword(userPassword: string): Promise<string> {
  const saltRounds = 10;
  const hash = await bcrypt.hash(userPassword, saltRounds);
  return hash;
}

async function verifyPassword(providedPassword: string, storedHash: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(providedPassword, storedHash);
  return isMatch;
}



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'public', 'uploads'), { prefix: '/uploads' });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', '/views/partials'));
  hbs.registerPartials(join(__dirname, '..', '/views/partials-index'));


  hbs.registerHelper("formatDate", function (date, format) {
    if (!date) return "";
    return dayjs(date).format(format || "MMM D, YYYY");
  });

  hbs.registerHelper("eq", (a, b) => a === b);

  // Returns the value at obj[key], used for builtin section content lookup
  hbs.registerHelper("get", (obj, key) => (obj && key) ? obj[key] : undefined);

  // Returns true if builtinMap[key] exists and isVisible is explicitly false
  hbs.registerHelper("builtinHidden", (builtinMap, key) => {
    const rec = builtinMap && builtinMap[key];
    return rec && rec.isVisible === false;
  });

  hbs.registerHelper("parseJSON", (str) => {
    try { return JSON.parse(str); } catch { return null; }
  });

  app.use(cookieParser());

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);

  // Test bcrypt
  const hash = await hashPassword('mySecret123');
  console.log('Hashed password:', hash);

  const isMatch = await verifyPassword('mySecret123', hash);
  console.log('Password match:', isMatch); // true

  const isWrong = await verifyPassword('wrongPassword', hash);
  console.log('Wrong password match:', isWrong); // false
}
bootstrap();
