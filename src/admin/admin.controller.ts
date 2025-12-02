//src/admin/admin.controller.ts
import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRoleEnum } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('approval')
  @Roles(UserRoleEnum.ADMIN) // only ADMIN can access
  getPendingOrgs() {
    return this.adminService.getPendingOrgs();
  }

  
  @Patch('approve/:orgId')
  @Roles(UserRoleEnum.ADMIN)
  approveOrg(@Param('orgId') orgId: string) {
    return this.adminService.approveOrg(orgId);
  }

  @Patch('reject/:orgId')
  @Roles(UserRoleEnum.ADMIN)
  rejectOrg(@Param('orgId') orgId: string) {
    return this.adminService.rejectOrg(orgId);
  }
}
