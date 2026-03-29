import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity('trainers')
export class Trainer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  role: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  fullName_hy: string;

  @Column({ nullable: true })
  fullName_ru: string;

  @Column({ nullable: true })
  role_hy: string;

  @Column({ nullable: true })
  role_ru: string;

  @Column({ type: 'text', nullable: true })
  description_hy: string;

  @Column({ type: 'text', nullable: true })
  description_ru: string;

  @Column({ type: 'text', nullable: true })
  image: string;

  // Many-to-Many Schedules
  @ManyToMany(() => Schedule, (schedule) => schedule.trainers)
  schedules: Schedule[];
}
