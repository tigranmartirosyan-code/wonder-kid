import {
  Body, Delete, Get, Param, Patch, Post
} from '@nestjs/common';

// Generic base controller
export class BaseController<
  TCreateDto,
  TUpdateDto,
  TService extends {
    create(dto: TCreateDto): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, dto: TUpdateDto): any;
    remove(id: string): any;
  }
> {
  constructor(protected readonly service: TService) {}

  @Post()
  create(@Body() dto: TCreateDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: TUpdateDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
