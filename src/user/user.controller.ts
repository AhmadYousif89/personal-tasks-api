import { Controller, Delete, Get, Patch } from '@nestjs/common';

import { GetUserId, Protected, ValidateBody } from './../common/decorators';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Protected()
  @Get('me')
  getUserById(@GetUserId() id: string) {
    return this.userService.getUserById(id);
  }

  @Protected()
  @Patch('me')
  updateUserById(@GetUserId() id: string, @ValidateBody() data: EditUserDto) {
    return this.userService.updateUserById(id, data);
  }

  @Protected()
  @Delete('me')
  deleteUserById(@GetUserId() id: string) {
    return this.userService.deleteUserById(id);
  }
}
