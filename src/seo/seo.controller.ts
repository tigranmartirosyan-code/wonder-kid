import { Controller } from '@nestjs/common';
import { SeoService } from './seo.service';
import { CreateSeoDto } from './dto/create-seo.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';
import { BaseController } from '../base.controller';

@Controller('seo')
export class SeoController extends BaseController<CreateSeoDto, UpdateSeoDto, SeoService> {
  constructor(seoService: SeoService) {
    super(seoService);
  }
}
