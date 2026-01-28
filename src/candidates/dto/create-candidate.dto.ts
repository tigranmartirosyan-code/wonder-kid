import { IsString, IsOptional, IsEmail, IsInt, Min, Max } from 'class-validator';

export class CreateCandidateDto {
  fullName: string;
  email: string;
  age?: number;
  gender?: string;
  phones: string; // required because entity does not allow null
}