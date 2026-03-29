import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandingSection } from './entities/landing-section.entity';
import { LandingSectionsService } from './landing-sections.service';
import { LandingSectionsController } from './landing-sections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LandingSection])],
  controllers: [LandingSectionsController],
  providers: [LandingSectionsService],
  exports: [LandingSectionsService],
})
export class LandingSectionsModule {}
