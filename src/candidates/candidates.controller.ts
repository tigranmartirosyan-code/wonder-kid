import { Body, Controller, Post, Redirect } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { BaseController } from '../base.controller';

@Controller('candidates')
export class CandidatesController extends BaseController<
  CreateCandidateDto,
  UpdateCandidateDto,
  CandidatesService
> {
  protected searchFields = ['fullName', 'gender', 'phones'];
  protected filterFields = ['gender', 'age'];

  constructor(candidatesService: CandidatesService) {
    super(candidatesService);
  }

  @Post('register')
  @Redirect('/')
  async register(@Body() dto: CreateCandidateDto) {
    console.log(dto)
    const result = this.service.create(dto);
    return result;
  }
}
