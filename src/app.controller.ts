// backend/src/app.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { RabbitService } from './rabbit/rabbit.service';

@Controller('api/messages')
export class MessageController {
  constructor(private readonly rabbitService: RabbitService) {}

  @Post('send')
  async sendMessage(@Body('text') text: string) {
    await this.rabbitService.sendMessage(text);
    return { status: 'Message sent' };
  }
}

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return { message: 'Backend is running!' };
  }
}
