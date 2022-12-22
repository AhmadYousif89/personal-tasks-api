import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as argon from 'argon2';

import { PrismaService } from './../prisma/prisma.service';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { GoogleUser, Tokens } from './types';
import { User } from '@prisma/client';

@Injectable()
export class AuthServices {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthRegisterDto) {
    try {
      const { name, email, password } = dto;

      const hash = await argon.hash(password);
      const data = { name, email, hash };
      const user = await this.prisma.user.create({ data });

      const { refreshToken } = await this.generateTokens({ id: user.id });

      await this.updateRt(user.id, refreshToken);
      this.deleteUserHash(user);
      return { user, refreshToken };
    } catch (err) {
      throw err;
    }
  }

  async login(dto: AuthLoginDto) {
    try {
      const { email, password } = dto;
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (user && !user.hash)
        throw new HttpException(
          `Unauthorized google user`,
          HttpStatus.UNAUTHORIZED,
        );

      const isPwValid = await argon.verify(user.hash, password);
      if (!isPwValid) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const { refreshToken } = await this.generateTokens({ id: user.id });

      await this.updateRt(user.id, refreshToken);
      this.deleteUserHash(user);
      return { user, refreshToken };
    } catch (err) {
      throw err;
    }
  }

  async loginWithGoogle(dto: GoogleUser) {
    try {
      const exUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      let user: User;
      if (!exUser) {
        user = await this.prisma.user.create({ data: { ...dto, hash: '' } });
      }

      const loggedUser = user || exUser;
      const userId = loggedUser.id;
      const { refreshToken } = await this.generateTokens({ id: userId });

      await this.updateRt(userId, refreshToken);
      this.deleteUserHash(loggedUser);
      return { user: loggedUser, refreshToken };
    } catch (err) {
      throw err;
    }
  }

  async refreshToken(id: string, jwt: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      // stored RT was deleted
      if (!user.rT)
        throw new HttpException(
          'Access denied, Deleted RT',
          HttpStatus.FORBIDDEN,
        );
      // comparing cookie RT with stored RT in DB
      const isRtValid = await argon.verify(user.rT, jwt);
      if (!isRtValid)
        throw new HttpException(
          'Access denied, Invalid RT',
          HttpStatus.FORBIDDEN,
        );
      // send new access token
      const { accessToken } = await this.generateTokens({ id: user.id });

      return { accessToken };
    } catch (err) {
      throw err;
    }
  }

  async resetPassword(dto: AuthLoginDto) {
    try {
      const { email, password } = dto;

      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user)
        throw new HttpException('Email not registered', HttpStatus.NOT_FOUND);

      const newHash = await argon.hash(password);
      await this.prisma.user.update({
        where: { email },
        data: { hash: newHash },
      });

      return { message: 'password updated' };
    } catch (err) {
      throw err;
    }
  }

  async logout(id: string, jwt: string, res: Response) {
    try {
      if (!jwt) return res.status(HttpStatus.NO_CONTENT).send();

      await this.prisma.user.updateMany({
        where: {
          id,
          rT: {
            not: null,
          },
        },
        data: {
          rT: null,
        },
      });

      return res
        .clearCookie('jwt', {
          secure: true,
          httpOnly: true,
          sameSite: 'none',
        })
        .status(HttpStatus.OK)
        .json({ message: 'cookie cleared' });
    } catch (err) {
      throw err;
    }
  }

  private async updateRt(userId: string, refreshToken: string) {
    const hashedRt = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { rT: hashedRt },
    });
  }

  private async generateTokens(id: { id: string }): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(id, {
        expiresIn: '1m',
        secret: this.config.get('ACCESS_SECRET_TOKEN'),
      }),
      this.jwt.signAsync(id, {
        expiresIn: '1d',
        secret: this.config.get('REFRESH_SECRET_TOKEN'),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private deleteUserHash(user: User) {
    delete user.hash;
    delete user.rT;
  }
}
