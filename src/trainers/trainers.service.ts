import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainer } from './entities/trainer.entity';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { AppService } from '../app.service';


@Injectable()
export class TrainersService extends AppService<Trainer, CreateTrainerDto, UpdateTrainerDto> {
  constructor(
    @InjectRepository(Trainer)
    private readonly trainerRepo: Repository<Trainer>,
  ) {
    super(trainerRepo);
  }

  // Custom method only for trainers
  async findByEmail(email: string): Promise<Trainer | null> {
    return this.trainerRepo.findOne({
      where: { email },
      relations: ['schedules'],
    });
  }
}