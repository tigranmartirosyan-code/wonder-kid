import { Controller } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { BaseController } from '../base.controller';

@Controller('trainers')
export class TrainersController extends BaseController<CreateTrainerDto, UpdateTrainerDto, TrainersService> {
  protected searchFields = ['fullName', 'role', 'phone', 'description'];
  protected filterFields = ['role', 'fullName'];
  protected defaultRelations = ['schedules'];

  constructor(trainersService: TrainersService) {
    super(trainersService);
  }
}
