import { Controller } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { Trainer } from './entities/trainer.entity';
import { BaseController } from '../base.controller';

@Controller('trainers')
export class TrainersController extends BaseController<CreateTrainerDto, UpdateTrainerDto, TrainersService> {
  constructor(trainersService: TrainersService) {
    super(trainersService, '/admin'); // redirect after create/update
  }
}