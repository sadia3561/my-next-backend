import { Controller, Get } from '@nestjs/common';

@Controller() // no prefix = root route
export class RootController {
  @Get() // GET /
  getRoot() {
    return 'Backend is running';
  }
}
