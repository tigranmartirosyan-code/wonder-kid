import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { AppService } from '../app.service';

@Injectable()
export class FaqService extends AppService<Faq, CreateFaqDto, UpdateFaqDto> {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
  ) {
    super(faqRepository);
  }
}
