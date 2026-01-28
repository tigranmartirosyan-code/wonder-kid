import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fullName' })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column()
  age: number;

  @Column()
  groupName: string;

  @Column()
  phones: string;

  // Many-to-Many Schedules
  @ManyToMany(() => Schedule, (schedule) => schedule.students)
  schedules: Schedule[];
}
