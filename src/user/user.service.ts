import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon from 'argon2';

import { PrismaService } from './../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
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

  async getUserById(id: string) {
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

  async updateUserById(id: string, dto: EditUserDto) {
    const { name, email, password } = dto;
    try {
      if (!name && !email && !password) return {};
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new HttpException('Access denied', HttpStatus.NOT_FOUND);
      }

      const isPassValid = /^((?!.*[\s])(?=.*\d).{3,})/.test(password);
      if (password && !isPassValid) {
        throw new HttpException(
          'required 3 characters at least with numbers and no spaces',
          HttpStatus.BAD_REQUEST,
        );
      }
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (email && !isEmailValid) {
        throw new HttpException('email not valid', HttpStatus.BAD_REQUEST);
      }

      let updatedUser: User;

      if (name) {
        updatedUser = await this.prisma.user.update({
          where: { id: user.id },
          data: { name },
        });
      }
      if (email) {
        updatedUser = await this.prisma.user.update({
          where: { id: user.id },
          data: { email },
        });
      }
      if (password) {
        const newHash = await argon.hash(password);
        updatedUser = await this.prisma.user.update({
          where: { id: user.id },
          data: { hash: newHash },
        });
      }

      this.deleteUserHash(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  async deleteUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      await this.prisma.user.delete({ where: { id: user.id } });

      return { success: 1, message: 'User deleted' };
    } catch (err) {
      throw err;
    }
  }

  private deleteUserHash(user: User) {
    delete user.hash;
    delete user.rT;
  }
}
