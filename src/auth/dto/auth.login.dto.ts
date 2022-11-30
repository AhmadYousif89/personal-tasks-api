import { Validate } from 'class-validator';
import {
  IsEmailValid,
  IsPasswordValid,
  ValidateEmailOnSignIn,
} from '../../common/validator';

export class AuthLoginDto {
  @Validate(IsEmailValid)
  @Validate(ValidateEmailOnSignIn)
  email: string;
  @Validate(IsPasswordValid)
  password: string;
}
