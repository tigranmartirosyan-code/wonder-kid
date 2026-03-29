import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { join } from 'path';
import * as fs from 'fs';

interface TranslateDto {
  texts: { title?: string; subtitle?: string; body?: string };
  localeSection: string;
  localeFields: { title?: string; subtitle?: string; body?: string };
}

const SUPPORTED_LANGS = ['ru', 'hy'] as const;

function loadLocale(lang: string): Record<string, any> {
  try {
    const file = join(process.cwd(), 'public', 'locales', `${lang}.json`);
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return {};
  }
}

function saveLocale(lang: string, data: Record<string, any>): void {
  const file = join(process.cwd(), 'public', 'locales', `${lang}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

@Controller('translate')
export class TranslateController {
  private client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  @Post()
  async translate(@Body() dto: TranslateDto) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new BadRequestException('ANTHROPIC_API_KEY is not configured');
    }

    const { texts, localeSection, localeFields } = dto;

    // Build list of non-empty text fields to translate
    const toTranslate: { field: keyof typeof texts; value: string }[] = [];
    for (const [field, val] of Object.entries(texts)) {
      if (val && val.trim()) toTranslate.push({ field: field as any, value: val.trim() });
    }
    if (toTranslate.length === 0) return { success: true };

    // Translate to Russian and Armenian in parallel
    const results: Record<string, Record<string, string>> = { ru: {}, hy: {} };

    await Promise.all(
      SUPPORTED_LANGS.map(async (lang) => {
        const langName = lang === 'ru' ? 'Russian' : 'Armenian';
        const textsBlock = toTranslate
          .map((t, i) => `[${i + 1}] ${t.value}`)
          .join('\n\n');

        const message = await this.client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `Translate the following texts to ${langName}. Return ONLY the translations numbered the same way, with no extra commentary. If a text contains HTML tags, preserve them exactly. Do not add or remove any HTML tags.

${textsBlock}`,
            },
          ],
        });

        const responseText =
          message.content[0].type === 'text' ? message.content[0].text : '';

        // Parse numbered responses
        const lines = responseText.split(/\n+/);
        let currentIndex = -1;
        const collected: string[] = [];

        for (const line of lines) {
          const match = line.match(/^\[(\d+)\]\s*(.*)/);
          if (match) {
            currentIndex = parseInt(match[1], 10) - 1;
            collected[currentIndex] = match[2];
          } else if (currentIndex >= 0 && line.trim()) {
            collected[currentIndex] = (collected[currentIndex] || '') + '\n' + line;
          }
        }

        toTranslate.forEach((t, i) => {
          if (collected[i] && collected[i].trim()) {
            results[lang][t.field] = collected[i].trim();
          }
        });
      }),
    );

    // Write translations to locale JSON files
    for (const lang of SUPPORTED_LANGS) {
      const langResults = results[lang];
      if (Object.keys(langResults).length === 0) continue;

      const locale = loadLocale(lang);
      const section = locale[localeSection] || {};

      for (const [field, translatedText] of Object.entries(langResults)) {
        const localeKey = localeFields[field as keyof typeof localeFields];
        if (localeKey) {
          section[localeKey] = translatedText;
        }
      }

      locale[localeSection] = section;
      saveLocale(lang, locale);
    }

    return { success: true, translations: results };
  }
}
