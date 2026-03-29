export class CreateTrainerDto {
  fullName: string;
  role: string;
  email?: string;
  password?: string;
  phone?: string;
  description: string;
  image: string;
  fullName_hy?: string;
  fullName_ru?: string;
  role_hy?: string;
  role_ru?: string;
  description_hy?: string;
  description_ru?: string;
}