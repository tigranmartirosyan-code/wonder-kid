import { Controller } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { BaseController } from '../base.controller';

@Controller('students')
export class StudentsController extends BaseController<CreateStudentDto, UpdateStudentDto, StudentsService> {
  constructor(studentsService: StudentsService) {
    super(studentsService);
  }
}