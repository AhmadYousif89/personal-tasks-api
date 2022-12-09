import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { corsOptions } from './cors-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors(corsOptions);
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT || 8520);
}
bootstrap();
