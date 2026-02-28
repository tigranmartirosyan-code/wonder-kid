import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from './entities/page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { AppService } from '../app.service';

@Injectable()
export class PagesService extends AppService<Page, CreatePageDto, UpdatePageDto> {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {
    super(pageRepository);
  }
}
