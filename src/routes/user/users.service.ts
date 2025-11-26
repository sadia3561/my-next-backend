// src/routes/user/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  // Get all pending organizations
  async getPending() {
    return this.prisma.organization.findMany({
      where: { pendingApproval: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Approve organization
  async approveOrg(orgId: string) {
    const org = await this.prisma.organization.update({
      where: { id: orgId },
      data: { pendingApproval: false, status: 'APPROVED' },
    });

    if (!org) throw new NotFoundException('Organization not found');

    // send approved email
    await this.mail.sendApprovedEmail('user@example.com', org.name); // replace email as needed

    return org;
  }

  // Reject organization
  async rejectOrg(orgId: string) {
    const org = await this.prisma.organization.update({
      where: { id: orgId },
      data: { pendingApproval: false, status: 'REJECTED' },
    });

    if (!org) throw new NotFoundException('Organization not found');

    // optional: send rejected email

    return org;
  }
}
