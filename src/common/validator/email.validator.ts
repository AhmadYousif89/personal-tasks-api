import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'IsEmailValid', async: true })
export class IsEmailValid implements ValidatorConstraintInterface {
  async validate(value: string): Promise<boolean> {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isEmailValid) {
      throw new HttpException(
        'email is not a valid email',
        HttpStatus.BAD_REQUEST,
      );
    }
    return isEmailValid ? true : false;
  }
  defaultMessage(): string {
    throw new HttpException(
      'email is not a valid email',
      HttpStatus.BAD_REQUEST,
    );
  }
}
