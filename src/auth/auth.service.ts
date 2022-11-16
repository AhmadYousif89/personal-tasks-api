import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as argon from 'argon2';

import { PrismaService } from './../prisma/prisma.service';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthServices {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: AuthRegisterDto, res: Response) {
    try {
      const name = this.trim(dto.name);
      const email = this.trim(dto.email);
      const isPassValid = /^((?!.*[\s])(?=.*\d).{3,})/.test(dto.password);

      if (!isPassValid) {
        throw new HttpException(
          'password must be at least 3 characters with 1 number and no spaces',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hash = await argon.hash(dto.password);

      const data = { name, email, hash };
      const user = await this.prisma.user.create({ data });

      const tokens = await this.generateTokens({
        id: user.id,
        name: user.name,
        email: user.email,
      });
      await this.updateRt(user.id, tokens.refreshToken);

      return res
        .cookie('jwt', tokens.refreshToken, {
          secure: true, // to be change in production
          httpOnly: true,
          sameSite: 'none',
          maxAge: 5 * 60 * 1000,
        })
        .json({ aT: tokens.accessToken });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002')
          throw new HttpException(
            'Credentials already exist',
            HttpStatus.FORBIDDEN,
          );
      }
      throw err;
    }
  }

  async login(dto: AuthLoginDto, res: Response) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const isPwValid = await argon.verify(user.hash, dto.password);
      if (!isPwValid) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const tokens = await this.generateTokens({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      await this.updateRt(user.id, tokens.refreshToken);

      return res
        .cookie('jwt', tokens.refreshToken, {
          secure: false, // to be change in production
          httpOnly: true,
          sameSite: 'none',
          maxAge: 2 * 60 * 1000,
          // domain: 'http://localhost:5173',
        })
        .json({ aT: tokens.accessToken });
    } catch (err) {
      throw err;
    }
  }

  async refreshToken(id: string, jwt: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user)
        throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
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
      const tokens = await this.generateTokens({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      return { aT: tokens.accessToken };
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
        .json({ message: 'Cookie cleared' });
    } catch (err) {
      throw err;
    }
  }

  private async updateRt(userId: string, rt: string) {
    const hashedRt = await argon.hash(rt);
    await this.prisma.user.update({
      where: { id: userId },
      data: { rT: hashedRt },
    });
  }

  private async generateTokens(user: {
    id: string;
    name: string;
    email: string;
  }): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(user, {
        expiresIn: '30s',
        secret: this.config.get('ACCESS_SECRET_TOKEN'),
      }),
      this.jwt.signAsync(user, {
        expiresIn: '2m',
        secret: this.config.get('REFRESH_SECRET_TOKEN'),
      }),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  private trim(text: string) {
    return text?.trim();
  }
}
