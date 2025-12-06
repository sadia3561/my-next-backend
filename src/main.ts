import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⚡ All APIs start with /api
  app.setGlobalPrefix('api');

  // ⚡ CORS: allow your frontend URLs
  app.enableCors({
    origin: [
      'https://my-next-frontend-sadiyas-projects-67d7bf27.vercel.app',
      // add more frontend URLs if needed
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ⚡ JSON body limit
  app.use(json({ limit: '5mb' }));

  // ⚡ Root route for checking server
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (req: Request, res: Response) => {
    res.send('Backend is running 🚀');
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend running on port ${port}`);
}

bootstrap();
