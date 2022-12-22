import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthServices } from './auth.service';
import { AuthController } from './auth.controller';
import { AtStrategy, RtStrategy } from './strategies';
import {
  IsPasswordValid,
  ValidateEmailOnSignUp,
  ValidateEmailOnSignIn,
} from '../common/validator';
import { GoogleStrategy } from './strategies/googleOAuth.strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AtStrategy,
    RtStrategy,
    AuthServices,
    GoogleStrategy,
    IsPasswordValid,
    ValidateEmailOnSignUp,
    ValidateEmailOnSignIn,
  ],
})
export class AuthModule {}
