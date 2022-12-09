import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { UploadApiResponse } from 'cloudinary';
import cloudinary from 'src/cloudinary/cloudinary';

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
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      if (user && !user.rT)
        throw new HttpException(
          'Access denied, Deleted RT',
          HttpStatus.FORBIDDEN,
        );

      this.deleteUserHash(user);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async updateUserById(id: string, dto: EditUserDto) {
    const { name, email, password, image } = dto;
    if (!name && !email && !password && !image) return {};
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!image.includes(';base64,'))
        throw new HttpException('image is not valid', HttpStatus.BAD_REQUEST);

      const imgFlag = user.id.split('-')[0] + '_image';
      let uploadedImage: UploadApiResponse;

      if (image) {
        uploadedImage = await cloudinary.uploader.upload(image, {
          overwrite: true,
          public_id: imgFlag,
          upload_preset: 'Personal_Tasks',
        });
      }

      let updatedUser: User;
      if (password) {
        const newHash = await argon.hash(password);
        updatedUser = await this.prisma.user.update({
          where: { id: user.id },
          data: { name, email, image: uploadedImage.secure_url, hash: newHash },
        });
      } else {
        updatedUser = await this.prisma.user.update({
          where: { id: user.id },
          data: { name, email, image: uploadedImage.secure_url },
        });
      }

      this.deleteUserHash(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  async updateUserImage(id: string, image: string) {
    if (!image) return {};

    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: { image },
      });

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

      return { message: 'User deleted' };
    } catch (err) {
      throw err;
    }
  }

  private deleteUserHash(user: User) {
    delete user.hash;
    delete user.rT;
  }
}
