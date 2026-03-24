import {
  Body, Delete, Get, Param, Patch, Post, Query
} from '@nestjs/common';

// Generic base controller
export class BaseController<
  TCreateDto,
  TUpdateDto,
  TService extends {
    create(dto: TCreateDto): any;
    findAll(relations?: string[]): any;
    findPaginated(options: any): any;
    findOne(id: string): any;
    update(id: string, dto: TUpdateDto): any;
    remove(id: string): any;
  }
> {
  protected searchFields: string[] = [];
  protected filterFields: string[] = [];
  protected defaultRelations: string[] = [];

  constructor(protected readonly service: TService) {}

  @Post()
  create(@Body() dto: TCreateDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    if (query.page || query.limit || query.search) {
      const filters: Record<string, string> = {};
      this.filterFields.forEach(f => {
        if (query[f]) filters[f] = query[f];
      });
      return this.service.findPaginated({
        page: parseInt(query.page) || 1,
        limit: parseInt(query.limit) || 10,
        search: query.search || '',
        searchFields: this.searchFields,
        filters,
        relations: this.defaultRelations,
        filterFields: this.filterFields,
      });
    }
    return this.service.findAll(this.defaultRelations);
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
