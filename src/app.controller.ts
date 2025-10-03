// backend/src/app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return { message: 'Backend is running!' };
  }
}
