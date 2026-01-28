import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

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

