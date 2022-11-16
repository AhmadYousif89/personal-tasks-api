import {
  Get,
  Res,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Controller,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Cookies } from './../common/decorators';

import { GetUserId, Protected } from './../common/decorators';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { RtAuthGuard } from './../common/guards';
import { AuthServices } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthServices) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: AuthRegisterDto, @Res() res: Response) {
    await this.authServices.register(dto, res);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthLoginDto, @Res() res: Response) {
    await this.authServices.login(dto, res);
  }

  @Get('refresh')
  // @UseGuards(RtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@GetUserId() id: string, @Cookies('jwt') jwt: string) {
    console.log({ jwt });
    return this.authServices.refreshToken(id, jwt);
  }

  @Protected()
  @Post('logout')
  async logout(
    @Res() res: Response,
    @GetUserId() id: string,
    @Cookies('jwt') jwt: string,
  ) {
    await this.authServices.logout(id, jwt, res);
  }
}
