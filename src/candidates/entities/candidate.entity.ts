import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ nullable: true, })
  age: number;

  @Column({ nullable: true, })
  gender: string;

  @Column()
  phones: string;
}