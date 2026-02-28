export class CreateSeoDto {
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}
