import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthServices } from './auth.service';
import { AuthController } from './auth.controller';
import { AtStrategy, RtStrategy } from './strategies';
import {
  ValidateEmailOnSignUp,
  ValidateEmailOnSignIn,
  IsPasswordValid,
} from '../common/validator';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthServices,
    AtStrategy,
    RtStrategy,
    ValidateEmailOnSignUp,
    ValidateEmailOnSignIn,
    IsPasswordValid,
  ],
})
export class AuthModule {}
