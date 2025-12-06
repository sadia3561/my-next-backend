import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express'; // <-- import types
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'https://my-next-frontend-seven.vercel.app',
      'https://my-next-frontend-sadiyas-projects-67d7bf27.vercel.app',
      'https://my-next-frontend-git-main-sadiyas-projects-67d7bf27.vercel.app',
      'https://my-next-frontend-8644rh4ws-sadiyas-projects-67d7bf27.vercel.app'
    ],
    methods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
  });

  app.use(json({ limit: '5mb' }));

  // ✅ Express root route with proper types
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (req: Request, res: Response) => {
    res.send('Backend is running');
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend is running on port ${port}`);
}

bootstrap();
