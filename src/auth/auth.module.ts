import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StudentsModule } from '../students/students.module';

@Module({
  imports:[StudentsModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [ AuthService ],
})
export class AuthModule {}
