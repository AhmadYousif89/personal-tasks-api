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
  private timeToExpire = 24 * 60 * 60 * 1000; // (1 Day)

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthRegisterDto, res: Response) {
    try {
      const name = dto.name.trim();
      const email = dto.email.trim();
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

      this.attachCookie(res, tokens.refreshToken);
      return res.json({ message: 'user created' });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new HttpException('Email already exist', HttpStatus.CONFLICT);
        }
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
        throw new HttpException(
          'Email not registered',
          HttpStatus.UNAUTHORIZED,
        );
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

      this.attachCookie(res, tokens.refreshToken);
      return res.json({ message: 'user logged in' });
    } catch (err) {
      throw err;
    }
  }

  async refreshToken(id: string, jwt: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
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

  async resetPassword(dto: AuthLoginDto) {
    try {
      const email = dto.email.trim();
      const password = dto.password.trim();

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
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          sameSite: 'none',
        })
        .status(HttpStatus.OK)
        .json({ message: 'cookie cleared' });
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

  private attachCookie(res: Response, token: string) {
    res.cookie('jwt', token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: this.timeToExpire,
    });
  }

  private async generateTokens(user: {
    id: string;
    name: string;
    email: string;
  }): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(user, {
        expiresIn: '1m',
        secret: this.config.get('ACCESS_SECRET_TOKEN'),
      }),
      this.jwt.signAsync(user, {
        expiresIn: '1d',
        secret: this.config.get('REFRESH_SECRET_TOKEN'),
      }),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
