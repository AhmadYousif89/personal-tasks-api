import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'IsPasswordValid', async: true })
export class IsPasswordValid implements ValidatorConstraintInterface {
  async validate(value: string): Promise<boolean> {
    const isPasswordValid = /^((?!.*[\s])(?=.*\d).{3,})/.test(value);
    return isPasswordValid ? true : false;
  }
  defaultMessage(): string {
    throw new HttpException(
      'required at least 3 characters with numbers and no spaces',
      HttpStatus.BAD_REQUEST,
    );
  }
}
