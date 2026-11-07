import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

export const API_PREFIX = 'api';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.setGlobalPrefix(API_PREFIX);

  // Em producao o frontend e a API ficam na mesma origem (Vercel), entao CORS
  // so e necessario quando CORS_ORIGINS for configurado explicitamente.
  const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (allowedOrigins.length > 0) {
    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  return app;
}
