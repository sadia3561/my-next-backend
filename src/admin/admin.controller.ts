import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RegistrationStatus, KycStatus, UserRoleEnum } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ✅ Get all registrations
  @Get('registrations')
  getAllRegistrations() {
    return this.adminService.getAllRegistrations();
  }

  // ✅ Get registration by ID
  @Get('registration/:id')
  getRegistrationById(@Param('id') id: string) {
    return this.adminService.getRegistrationById(id);
  }

  // ✅ Update registration status
  @Patch('registration/:id/status')
  updateRegistrationStatus(@Param('id') id: string, @Body() body: { status: string }) {
    const status = body.status.toUpperCase() as keyof typeof RegistrationStatus;
    return this.adminService.updateRegistrationStatus(id, RegistrationStatus[status]);
  }

  // ✅ Get all KYC queue items
  @Get('kyc-queue')
  getKycQueue() {
    return this.adminService.getQueueItems();
  }

  // ✅ Update KYC status
  @Patch('kyc/:id/status')
  updateKycStatus(@Param('id') id: string, @Body() body: { status: string }) {
    const status = body.status.toUpperCase() as keyof typeof KycStatus;
    return this.adminService.updateKycStatus(id, KycStatus[status]);
  }

  // ✅ Get all users
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  // ✅ Update user role
  @Patch('user/:id/role')
  updateUserRole(@Param('id') id: string, @Body() body: { role: string }) {
    const role = body.role.toUpperCase() as keyof typeof UserRoleEnum;
    return this.adminService.updateUserRole(id, UserRoleEnum[role]);
  }
}
