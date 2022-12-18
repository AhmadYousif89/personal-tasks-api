import {
  Get,
  Res,
  Post,
  Body,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
} from '@nestjs/common';
import { Response } from 'express';

import { GoogleUser } from './types';
import { AuthServices } from './auth.service';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { RtAuthGuard } from './../common/guards';
import {
  Cookies,
  GetUserId,
  Protected,
  GetGoogleUser,
} from './../common/decorators';

@Controller('auth')
export class AuthController {
  private timeToExpire = 24 * 60 * 60 * 1000; // (1 Day)

  constructor(private readonly authServices: AuthServices) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: AuthRegisterDto, @Res() res: Response) {
    const { user, refreshToken } = await this.authServices.register(dto);
    this.attachCookie(res, refreshToken);
    return res.json(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthLoginDto, @Res() res: Response) {
    const { user, refreshToken } = await this.authServices.login(dto);
    this.attachCookie(res, refreshToken);
    return res.json(user);
  }

  @Post('google/login')
  @HttpCode(HttpStatus.OK)
  async validateGoogleUser(
    @GetGoogleUser() gUser: GoogleUser,
    @Res() res: Response,
  ) {
    const { user, refreshToken } = await this.authServices.loginWithGoogle(
      gUser,
    );
    this.attachCookie(res, refreshToken);
    return res.json(user);
  }

  @Get('refresh')
  @UseGuards(RtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@GetUserId() id: string, @Cookies('jwt') jwt: string) {
    return this.authServices.refreshToken(id, jwt);
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: AuthLoginDto) {
    return this.authServices.resetPassword(dto);
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

  private attachCookie(res: Response, token: string) {
    res.cookie('jwt', token, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: this.timeToExpire,
    });
  }
}
