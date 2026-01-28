import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseController } from '../base.controller';

@Controller('users')
export class UsersController extends BaseController<CreateUserDto, UpdateUserDto, UsersService> {
  constructor(usersService: UsersService) {
    super(usersService, '/admin'); // redirect after create/update
  }
}