import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { Schedule } from './entities/schedule.entity';
import { Student } from '../students/entities/student.entity';
import { Trainer } from '../trainers/entities/trainer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Student, Trainer]), // <-- add Student and Trainer
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}