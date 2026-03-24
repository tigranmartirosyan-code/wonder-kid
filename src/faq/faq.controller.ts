import { Controller } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { BaseController } from '../base.controller';

@Controller('faq')
export class FaqController extends BaseController<CreateFaqDto, UpdateFaqDto, FaqService> {
  protected searchFields = ['question', 'answer', 'category'];
  protected filterFields = ['category', 'sortOrder'];

  constructor(faqService: FaqService) {
    super(faqService);
  }
}
