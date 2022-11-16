import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';

import { GetUserId, Protected } from './../common/decorators';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  allUsers() {
    return this.userService.getUsers();
  }

  @Protected()
  @Get('me')
  getUser(@GetUserId() id: string) {
    return this.userService.getUser(id);
  }

  @Protected()
  @Patch('me')
  updateUser(@GetUserId() id: string, @Body() data: EditUserDto) {
    return this.userService.updateUser(id, data);
  }

  @Protected()
  @Delete('me')
  deleteUser(@GetUserId() id: string) {
    return this.userService.deleteUser(id);
  }
}
