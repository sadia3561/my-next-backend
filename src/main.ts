import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⚡ GLOBAL PREFIX: All APIs will start with /api
  app.setGlobalPrefix('api');

  // ⚡ Proper CORS settings
  app.enableCors({
    origin: [
    //'http://localhost:3000',
    'https://my-next-frontend-seven.vercel.app',
    'https://my-next-frontend-sadiyas-projects-67d7bf27.vercel.app',
    'https://my-next-frontend-git-main-sadiyas-projects-67d7bf27.vercel.app',
    'https://my-next-frontend-8644rh4ws-sadiyas-projects-67d7bf27.vercel.app'
  ],
  
    
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ⚡ Increase JSON size limit
  app.use(json({ limit: '5mb' }));

  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend is running on port ${port} `);
}
bootstrap();
