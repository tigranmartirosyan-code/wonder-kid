import { Controller } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { BaseController } from '../base.controller';


@Controller('courses')
export class CoursesController extends BaseController<CreateCourseDto, UpdateCourseDto, CoursesService> {
  constructor(coursesService: CoursesService) {
    super(coursesService, '/admin'); // redirect after create/update
  }
}