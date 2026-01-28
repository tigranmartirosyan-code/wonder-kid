import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Trainer } from '../../trainers/entities/trainer.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ type: 'varchar', length: 20 })
  color: string;

  // Many-to-Many Students
  @ManyToMany(() => Student, (student) => student.schedules, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'schedule_students',
    joinColumn: { name: 'scheduleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'studentId', referencedColumnName: 'id' },
  })
  students: Student[];

  // Many-to-Many Trainers
  @ManyToMany(() => Trainer, (trainer) => trainer.schedules, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'schedule_trainers',
    joinColumn: { name: 'scheduleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'trainerId', referencedColumnName: 'id' },
  })
  trainers: Trainer[];
}
