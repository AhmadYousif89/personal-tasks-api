import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthServices } from './auth.service';
import { AuthController } from './auth.controller';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthServices, AtStrategy, RtStrategy],
})
export class AuthModule {}
