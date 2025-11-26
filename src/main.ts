import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // allow large payloads when frontend posts big JSON (optional)
  app.use(json({ limit: '5mb' }));
  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port);
  console.log(`🚀 Backend is running on http://localhost:${port}`);
}
bootstrap();
