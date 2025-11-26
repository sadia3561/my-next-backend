import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('org')
export class OrgController {
  constructor(
    private mailService: MailService,
    private prisma: PrismaService
  ) {}

  @Post('register')
  async registerOrg(@Body() body: any) {
    const org = await this.prisma.organization.create({
      data: {
        name: body.orgName,
        gstin: body.gstin,
        address: body.address,
        website: body.website,
        pendingApproval: true,
        status: "PENDING"
      }
    });

    await this.mailService.sendApprovalPendingEmail(body.email, org.name);

    return {
      message: 'Registration submitted, check email.',
      org,
    };
  }

  @Post('approve')
  async approveOrg(@Body() body: any) {
    const updated = await this.prisma.organization.update({
      where: { id: body.id },
      data: {
        pendingApproval: false,
        status: "APPROVED"
      }
    });

    await this.mailService.sendApprovedEmail(body.email, updated.name);

    return { message: 'Organization approved and email sent.' };
  }
}
