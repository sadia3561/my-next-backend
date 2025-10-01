import { Controller, Get, Post, Patch, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('api/admin/roles')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getRoles() {
    return this.adminService.getRoles();
  }

  @Post()
  async createRole(@Body() body: any) {
    return this.adminService.createRole(body);
  }

  @Patch()
  async updateRole(@Body() body: any) {
    return this.adminService.updateRole(body);
  }
}
