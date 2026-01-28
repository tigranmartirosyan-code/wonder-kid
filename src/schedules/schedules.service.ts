import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Student } from '../students/entities/student.entity';
import { Trainer } from '../trainers/entities/trainer.entity';
import { AppService } from '../app.service';

@Injectable()
export class SchedulesService extends AppService<
  Schedule,
  CreateScheduleDto,
  UpdateScheduleDto
> {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,

    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(Trainer)
    private readonly trainerRepo: Repository<Trainer>,
  ) {
    super(scheduleRepo);
  }

  // --- Override create with extra logic ---

  // @ts-ignore
  async create(dto: CreateScheduleDto): Promise<Schedule> {
    const { title, startDate, endDate, color, studentIds, trainerIds } = dto;

    const students = studentIds?.length
      ? await this.studentRepo.findByIds(studentIds)
      : [];

    const trainers = trainerIds?.length
      ? await this.trainerRepo.findByIds(trainerIds)
      : [];

    const schedule = this.scheduleRepo.create({
      title,
      startDate,
      endDate,
      color,
      students,
      trainers,
    });

    return this.scheduleRepo.save(schedule);
  }

  // --- Override update with relation logic ---
  async update(id: string, dto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findOne(id, ['students', 'trainers']);
    const { title, startDate, endDate, color, studentIds, trainerIds } = dto;

    if (title) schedule.title = title;
    if (startDate) schedule.startDate = startDate;
    if (endDate) schedule.endDate = endDate;
    if (color) schedule.color = color;

    if (studentIds) {
      schedule.students = await this.studentRepo.findByIds(studentIds);
    }

    if (trainerIds) {
      schedule.trainers = await this.trainerRepo.findByIds(trainerIds);
    }

    return this.scheduleRepo.save(schedule);
  }

  // --- Custom finder that loads relations ---
  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepo.find({ relations: ['students', 'trainers'] });
  }

  async findOne(id: string, relations: string[] = ['students', 'trainers']): Promise<Schedule> {
    const schedule = await this.scheduleRepo.findOne({
      where: { id },
      relations,
    });
    if (!schedule) throw new NotFoundException(`Schedule ${id} not found`);
    return schedule;
  }
}
