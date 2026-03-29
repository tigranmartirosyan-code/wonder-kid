import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import * as fs from 'fs';

const SUPPORTED = ['en', 'hy', 'ru'] as const;
type LangCode = (typeof SUPPORTED)[number];

function loadLocale(code: LangCode): any {
  try {
    const file = join(process.cwd(), 'public', 'locales', `${code}.json`);
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return {};
  }
}

@Injectable()
export class I18nMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const cookie = (req.cookies as any)?.lang;
    const lang: LangCode = SUPPORTED.includes(cookie as LangCode) ? (cookie as LangCode) : 'en';
    (req as any).lang = lang;
    (req as any).t = loadLocale(lang);
    next();
  }
}
