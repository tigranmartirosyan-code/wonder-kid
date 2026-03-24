import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';

interface ObjectLiteral {}

export abstract class AppService<
  T extends ObjectLiteral,
  CreateDto,
  UpdateDto,
> {
  protected constructor(protected readonly repository: Repository<T>) {}

  // Create
  async create(dto: CreateDto): Promise<T[]> {
    try {
      const entity: T[] = this.repository.create(dto as any);
      return await this.repository.save(entity);
    } catch (error) {
      throw new BadRequestException(
        'Failed to create entity: ' + error.message,
      );
    }
  }

  // Find all
  async findAll(relations: string[] = []): Promise<T[]> {
    try {
      return await this.repository.find({ relations });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch entities: ' + error.message,
      );
    }
  }

  // Find paginated with search and filters
  async findPaginated(options: {
    page?: number;
    limit?: number;
    search?: string;
    searchFields?: string[];
    filters?: Record<string, string>;
    relations?: string[];
    filterFields?: string[];
  }): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    filterOptions: Record<string, string[]>;
  }> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 10));
    const skip = (page - 1) * limit;

    const qb = this.repository.createQueryBuilder('entity');

    if (options.relations?.length) {
      options.relations.forEach(rel => {
        qb.leftJoinAndSelect(`entity.${rel}`, rel);
      });
    }

    if (options.search && options.searchFields?.length) {
      const searchFields = options.searchFields;
      qb.andWhere(
        new Brackets(wb => {
          searchFields.forEach((field, i) => {
            if (i === 0) {
              wb.where(`entity.${field} ILIKE :search`, { search: `%${options.search}%` });
            } else {
              wb.orWhere(`entity.${field} ILIKE :search`, { search: `%${options.search}%` });
            }
          });
        }),
      );
    }

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value) {
          qb.andWhere(`CAST(entity.${key} AS TEXT) = :filter_${key}`, { [`filter_${key}`]: value });
        }
      });
    }

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    const filterOptions: Record<string, string[]> = {};
    if (options.filterFields?.length) {
      for (const field of options.filterFields) {
        const result = await this.repository
          .createQueryBuilder('entity')
          .select(`DISTINCT CAST(entity.${field} AS TEXT)`, 'value')
          .where(`entity.${field} IS NOT NULL`)
          .andWhere(`CAST(entity.${field} AS TEXT) != ''`)
          .orderBy('value', 'ASC')
          .getRawMany();
        filterOptions[field] = result.map(r => r.value).filter(Boolean);
      }
    }

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      filterOptions,
    };
  }

  // Find one
  async findOne(id: string, relations: string[] = []): Promise<T> {
    try {
      const entity: Awaited<T> | null = await this.repository.findOne({
        where: { id } as any,
        relations,
      });
      if (!entity)
        throw new NotFoundException(`Entity with ID ${id} not found`);
      return entity;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Failed to fetch entity: ' + error.message,
      );
    }
  }

  // Update
  async update(
    id: string,
    dto: UpdateDto,
    relations: string[] = [],
  ): Promise<T> {
    try {
      const entity: Awaited<T> = await this.findOne(id, relations);
      Object.assign(entity, dto);
      return await this.repository.save(entity);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        'Failed to update entity: ' + error.message,
      );
    }
  }

  // Remove
  async remove(
    id: string,
    relations: string[] = [],
  ): Promise<{ message: string }> {
    try {
      const entity: Awaited<T> = await this.findOne(id, relations);
      await this.repository.remove(entity);
      return { message: `Entity with ID ${id} has been removed successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Failed to remove entity: ' + error.message,
      );
    }
  }
}
