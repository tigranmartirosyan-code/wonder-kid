import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { LandingSectionsService } from './landing-sections.service';
import { CreateLandingSectionDto } from './dto/create-landing-section.dto';
import { UpdateLandingSectionDto } from './dto/update-landing-section.dto';
import { BaseController } from '../base.controller';

@Controller('landing-sections')
export class LandingSectionsController extends BaseController<
  CreateLandingSectionDto,
  UpdateLandingSectionDto,
  LandingSectionsService
> {
  protected searchFields = ['sectionType', 'title', 'subtitle', 'body'];
  protected filterFields = ['sectionType'];

  constructor(landingSectionsService: LandingSectionsService) {
    super(landingSectionsService);
  }

  @Get('builtin/:key')
  async findBuiltinByKey(@Param('key') key: string) {
    const section = await this.service.findByBuiltinKey(key);
    if (!section) throw new NotFoundException();
    return section;
  }
}
