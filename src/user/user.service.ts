import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon from 'argon2';

import { PrismaService } from './../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    try {
      const users = await this.prisma.user.findMany({});
      if (users.length === 0)
        throw new HttpException('Found no users', HttpStatus.NOT_FOUND);

      for (const user of users) {
        this.deleteUserHash(user);
      }

      return users;
    } catch (err) {
      throw err;
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user)
        throw new HttpException(
          'Invalid user credentials',
          HttpStatus.FORBIDDEN,
        );
      if (user && !user.rT)
        throw new HttpException('Access denied', HttpStatus.FORBIDDEN);

      this.deleteUserHash(user);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async updateUser(id: string, dto: EditUserDto) {
    const { name, email, password } = dto;
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user)
        throw new HttpException(
          'Invalid user credentials',
          HttpStatus.FORBIDDEN,
        );

      const isPassValid = /^((?!.*[\s])(?=.*\d).{3,})/.test(dto.password);

      if (password && !isPassValid) {
        throw new HttpException(
          'password must be at least 3 characters with 1 number and no spaces',
          HttpStatus.BAD_REQUEST,
        );
      }

      let hash: string;
      let updatedUser: User;

      if (!password || password.trim().length === 0) {
        updatedUser = await this.prisma.user.update({
          where: { id: user.id },
          data: { name, email },
        });
      } else {
        hash = await argon.hash(password);
        updatedUser = await this.prisma.user.update({
          where: { id: user.id },
          data: { name, email, hash },
        });
      }
      this.deleteUserHash(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user)
        throw new HttpException(
          'Invalid user credentials',
          HttpStatus.FORBIDDEN,
        );

      await this.prisma.user.delete({ where: { id: user.id } });

      return { success: true, message: 'User deleted' };
    } catch (err) {
      throw err;
    }
  }

  private deleteUserHash(user: User) {
    delete user.hash;
    delete user.rT;
  }
}
