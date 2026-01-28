export class CreateScheduleDto {
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
  studentIds?: string[];
  trainerIds?: string[];
}
