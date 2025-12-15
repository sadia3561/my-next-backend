import { Controller, Get, Patch, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRoleEnum } from '@prisma/client';
import { MailService } from 'src/mail/mail.service'; // add

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly mailService: MailService, // add
  ) {}

  // ✅ Get pending organizations
  @Get('approval')
  @Roles(UserRoleEnum.ADMIN)
  getPendingOrgs() {
    return this.adminService.getPendingOrgs();
  }

  // ✅ Approve organization AND send email
  @Patch('approve/:orgId')
  @Roles(UserRoleEnum.ADMIN)
  async approveOrg(@Param('orgId') orgId: string) {
    // 1️⃣ Approve in DB
    const org = await this.adminService.approveOrg(orgId);

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return { message: 'Organization approved and email sent', org };
  }

  // ✅ Reject organization
  @Patch('reject/:orgId')
  @Roles(UserRoleEnum.ADMIN)
  async rejectOrg(@Param('orgId') orgId: string) {
    const org = await this.adminService.rejectOrg(orgId);

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return { message: 'Organization rejected', org };
  }
}
