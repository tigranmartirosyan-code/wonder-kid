export class CreateTrainerDto {
  fullName: string;
  role: string;
  email?: string;
  password?: string;
  phone?: string;
  description: string;
  image: string;
}