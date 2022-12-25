import { IsBoolean, IsOptional, IsString, Validate } from 'class-validator';
import { IsEmailValid, IsPasswordValid } from 'src/common/validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsOptional()
  @Validate(IsEmailValid)
  email?: string;
  @IsOptional()
  @Validate(IsPasswordValid)
  password?: string;
  @IsOptional()
  @IsString()
  image?: string;
  @IsOptional()
  @IsBoolean()
  isRegistered?: boolean;
}
