import { Controller } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { BaseController } from '../base.controller';

@Controller('courses')
export class CoursesController extends BaseController<CreateCourseDto, UpdateCourseDto, CoursesService> {
  protected searchFields = ['title', 'duration'];
  protected filterFields = ['duration', 'price'];

  constructor(coursesService: CoursesService) {
    super(coursesService);
  }
}
