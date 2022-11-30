import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
@ValidatorConstraint({ name: 'validateEmail', async: true })
export class ValidateEmailOnSignUp implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email: value } });
    return user ? false : true;
  }
  defaultMessage(): string {
    throw new HttpException('Email already exist', HttpStatus.CONFLICT);
  }
}
