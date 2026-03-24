import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseController } from '../base.controller';

@Controller('users')
export class UsersController extends BaseController<CreateUserDto, UpdateUserDto, UsersService> {
  protected searchFields = ['fullName', 'email', 'phone', 'role', 'work_type'];
  protected filterFields = ['role', 'work_type', 'fullName'];

  constructor(usersService: UsersService) {
    super(usersService);
  }
}
