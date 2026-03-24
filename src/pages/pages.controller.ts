import { Controller } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { BaseController } from '../base.controller';

@Controller('pages')
export class PagesController extends BaseController<CreatePageDto, UpdatePageDto, PagesService> {
  protected searchFields = ['title', 'slug', 'content', 'status'];
  protected filterFields = ['status', 'title'];

  constructor(pagesService: PagesService) {
    super(pagesService);
  }
}
