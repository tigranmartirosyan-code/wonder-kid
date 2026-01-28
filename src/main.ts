import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import  cookieParser from 'cookie-parser';
import hbs from 'hbs';
import dayjs from 'dayjs';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', '/views/partials'));
  hbs.registerPartials(join(__dirname, '..', '/views/partials-index'));


  hbs.registerHelper("formatDate", function (date, format) {
    if (!date) return "";
    return dayjs(date).format(format || "MMM D, YYYY");
  });

  app.use(cookieParser());

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
