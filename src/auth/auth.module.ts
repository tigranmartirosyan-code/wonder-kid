import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StudentsModule } from '../students/students.module';
import { TrainersModule } from '../trainers/trainers.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [StudentsModule, TrainersModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
