// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Render sets PORT environment variable
  const port = process.env.PORT || 4000;

  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
