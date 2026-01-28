import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AppService } from '../app.service';

@Injectable()
export class StudentsService extends AppService<Student, CreateStudentDto, UpdateStudentDto> {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {
    super(studentRepo);
  }

  // Custom method only for students
  async findByGroupName(groupName: string): Promise<Partial<Student>[]> {
    return this.studentRepo.find({
      where: { groupName },
      relations: ['schedules'],
      select: ['fullName', 'image'],
    });
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this.studentRepo.findOne({ where: { email } });
  }
}
