import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('faqs')
export class Faq {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
