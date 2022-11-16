import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { PrismaModule } from './prisma/prisma.module';

import { AtAuthGuard } from './common/guards';
import { MainController } from './app.controller';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TaskModule,
    PrismaModule,
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
  ],
  controllers: [MainController],
  providers: [{ provide: APP_GUARD, useClass: AtAuthGuard }],
})
export class AppModule {}
