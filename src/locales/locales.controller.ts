import { Controller, Patch, Param, Body, BadRequestException } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

const SUPPORTED_LANGS = ['en', 'hy', 'ru'] as const;

@Controller('locales')
export class LocalesController {
  @Patch(':lang')
  updateLocale(
    @Param('lang') lang: string,
    @Body() updates: Record<string, Record<string, string>>,
  ) {
    if (!SUPPORTED_LANGS.includes(lang as any)) {
      throw new BadRequestException('Unsupported language');
    }
    const file = join(process.cwd(), 'public', 'locales', `${lang}.json`);
    let current: Record<string, any> = {};
    try {
      current = JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
      current = {};
    }
    for (const [section, fields] of Object.entries(updates)) {
      if (typeof fields === 'object' && fields !== null) {
        current[section] = { ...(current[section] || {}), ...fields };
      }
    }
    fs.writeFileSync(file, JSON.stringify(current, null, 2), 'utf-8');
    return { success: true };
  }
}
