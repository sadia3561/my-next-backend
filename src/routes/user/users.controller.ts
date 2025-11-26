// src/routes/user/users.controller.ts
import { Controller, Get, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('pending')
  getPending() {
    return this.usersService.getPending();
  }

  @Patch('approve/:id')
  approveOrg(@Param('id') id: string) {
    return this.usersService.approveOrg(id);
  }

  @Patch('reject/:id')
  rejectOrg(@Param('id') id: string) {
    return this.usersService.rejectOrg(id);
  }
}
