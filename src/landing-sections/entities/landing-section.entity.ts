import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('landing_sections')
export class LandingSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  sectionType: string; // hero | about | features | stats | cta | testimonial | custom

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  subtitle: string | null;

  @Column({ type: 'text', nullable: true })
  body: string | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  imageUrl: string | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  imageUrl2: string | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  imageUrl3: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  buttonText: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  buttonLink: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '#ffffff' })
  backgroundColor: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: '#1f2937' })
  textColor: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: true })
  isVisible: boolean;

  // links this record to a built-in section (e.g. 'hero', 'about', 'contact')
  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  builtinKey: string | null;
}
