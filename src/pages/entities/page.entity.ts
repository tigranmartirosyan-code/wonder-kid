import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string;
}
