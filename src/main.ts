/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { EntityNotFoundExceptionFilter, QueryFailedExceptionFilter } from '@app/exception-filters';
import { exceptionFactory } from '@app/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, exceptionFactory: exceptionFactory }));
  app.useGlobalFilters(new EntityNotFoundExceptionFilter(), new QueryFailedExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
