import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';

import { GetUserId, Protected } from './../common/decorators';
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
  updateUserById(@GetUserId() id: string, @Body() dto: EditUserDto) {
    console.log(dto.image);
    return this.userService.updateUserById(id, dto);
  }

  @Protected()
  @Patch('me')
  updateUserImage(@GetUserId() id: string, @Body() image: string) {
    return this.userService.updateUserImage(id, image);
  }

  @Protected()
  @Delete('me')
  deleteUserById(@GetUserId() id: string) {
    return this.userService.deleteUserById(id);
  }
}
