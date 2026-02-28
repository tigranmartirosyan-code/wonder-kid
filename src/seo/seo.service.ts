import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seo } from './entities/seo.entity';
import { CreateSeoDto } from './dto/create-seo.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';
import { AppService } from '../app.service';

@Injectable()
export class SeoService extends AppService<Seo, CreateSeoDto, UpdateSeoDto> {
  constructor(
    @InjectRepository(Seo)
    private readonly seoRepository: Repository<Seo>,
  ) {
    super(seoRepository);
  }

  async findByPageName(pageName: string): Promise<Seo | null> {
    return this.seoRepository.findOne({ where: { pageName } });
  }
}
