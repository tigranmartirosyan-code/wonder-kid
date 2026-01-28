import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'blogs' })
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'timestamp' })
  date: Date | string;

  @Column({ type: 'varchar', length: 500 })
  image: string;

  @Column({ type: 'varchar', length: 100, name: 'category_color' })
  categoryColor: string;

  @Column({ type: 'varchar', length: 100, name: 'category_label' })
  categoryLabel: string;
}
