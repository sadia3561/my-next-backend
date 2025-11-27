import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS properly configure
  app.enableCors({
    origin: 'https://my-next-frontend-seven.vercel.app', // frontend URL
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // cookies/session ke liye
  });

  app.use(json({ limit: '5mb' }));

  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend is running on port ${port}`);
}
bootstrap();
