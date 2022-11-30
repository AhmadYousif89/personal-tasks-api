import { IsNotEmpty, IsString, Validate } from 'class-validator';
import {
  IsEmailValid,
  IsPasswordValid,
  ValidateEmailOnSignUp,
} from '../../common/validator';

export class AuthRegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @Validate(IsEmailValid)
  @Validate(ValidateEmailOnSignUp)
  email: string;
  @Validate(IsPasswordValid)
  password: string;
}
