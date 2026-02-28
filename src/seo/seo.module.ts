import { Module } from '@nestjs/common';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seo } from './entities/seo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seo])],
  controllers: [SeoController],
  providers: [SeoService],
  exports: [SeoService],
})
export class SeoModule {}
