import {
  Body, Delete, Get, Param, Patch, Post, Redirect
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
  constructor(protected readonly service: TService, private redirectPath?: string) {}

  @Post()
  @Redirect(`/admin`)
  create(@Body() dto: TCreateDto) {
    const result = this.service.create(dto);
    return result;
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
  @Redirect('/admin')
  update(@Param('id') id: string, @Body() dto: TUpdateDto) {
    const result = this.service.update(id, dto);
    if (this.redirectPath) return { url: this.redirectPath };
    return result;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
