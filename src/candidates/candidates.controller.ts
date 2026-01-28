import { Body, Controller, Get, Post, Redirect } from '@nestjs/common';
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
  constructor(candidatesService: CandidatesService) {
    super(candidatesService, '/admin'); // redirect after create/update
  }

  @Post('register')
  @Redirect('/')
  async register(@Body() dto: CreateCandidateDto) {
    console.log(dto)
    const result = this.service.create(dto);
    return result;
  }
}
