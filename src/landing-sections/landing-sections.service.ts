import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandingSection } from './entities/landing-section.entity';
import { CreateLandingSectionDto } from './dto/create-landing-section.dto';
import { UpdateLandingSectionDto } from './dto/update-landing-section.dto';
import { AppService } from '../app.service';

@Injectable()
export class LandingSectionsService extends AppService<LandingSection, CreateLandingSectionDto, UpdateLandingSectionDto> {
  constructor(
    @InjectRepository(LandingSection)
    private readonly sectionRepository: Repository<LandingSection>,
  ) {
    super(sectionRepository);
  }

  async findVisible(): Promise<LandingSection[]> {
    return this.sectionRepository
      .createQueryBuilder('s')
      .where('s.isVisible = :v', { v: true })
      .andWhere('s.builtinKey IS NULL')
      .orderBy('s.sortOrder', 'ASC')
      .getMany();
  }

  async findByBuiltinKey(key: string): Promise<LandingSection | null> {
    return this.sectionRepository.findOne({ where: { builtinKey: key } as any });
  }

  /** Returns a map of builtinKey → LandingSection for all built-in overrides */
  async findBuiltinMap(): Promise<Record<string, LandingSection>> {
    const rows = await this.sectionRepository
      .createQueryBuilder('s')
      .where('s.builtinKey IS NOT NULL')
      .getMany();
    const map: Record<string, LandingSection> = {};
    rows.forEach(r => { if (r.builtinKey) map[r.builtinKey] = r; });
    return map;
  }
}
