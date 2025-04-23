import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import createSwagger from './swagger';

export async function startApplication(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  // async function swaggerInitialize(): Promise<void> {
  if (process.env.NODE_ENV !== 'production') {
    await createSwagger(app);
  }
  // }

  await app.listen(4000);
}
