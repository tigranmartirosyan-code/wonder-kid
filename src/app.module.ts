import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './db/typeorm';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { CandidatesModule } from './candidates/candidates.module';
import { CoursesModule } from './courses/courses.module';
import { BlogsModule } from './blogs/blogs.module';
import { TrainersModule } from './trainers/trainers.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/EmailModule';
import { SchedulesModule } from './schedules/schedules.module';



// @ts-ignore
// @ts-ignore
@Module({
  imports: [
    ConfigModule.forRoot({

      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: undefined,
      useClass: TypeOrmConfigService,
    }),
    UsersModule,
    StudentsModule,
    CandidatesModule,
    CoursesModule,
    BlogsModule,
    TrainersModule,
    AuthModule,
    EmailModule,
    SchedulesModule

  ],

  controllers: [AppController],
  providers: [], // Add WebSocketGateway to providers
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/admin', method: RequestMethod.ALL },
        { path: '/profile', method: RequestMethod.ALL },
      );

  }
}
