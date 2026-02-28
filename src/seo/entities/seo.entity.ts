import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('seo')
export class Seo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  pageName: string;

  @Column({ type: 'varchar', length: 255 })
  metaTitle: string;

  @Column({ type: 'text' })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  ogImage: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  canonicalUrl: string;
}
