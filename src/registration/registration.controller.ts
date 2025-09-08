import { Controller, Get, Post, Body } from '@nestjs/common';
import { RegistrationService } from './registration.service';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  async create(@Body() body: { name: string; email: string }) {
    return this.registrationService.create(body);
  }

  @Get()
  async findAll() {
    return this.registrationService.findAll();
  }
}
