import { Controller } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { BaseController } from '../base.controller';

@Controller('schedules')
export class SchedulesController extends BaseController<CreateScheduleDto, UpdateScheduleDto, SchedulesService> {
  protected searchFields = ['title'];
  protected filterFields = ['color', 'title'];
  protected defaultRelations = ['students', 'trainers'];

  constructor(schedulesService: SchedulesService) {
    super(schedulesService);
  }
}
