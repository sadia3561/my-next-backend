import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrgService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async approveOrganization(orgId: string) {
    const org = await this.prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new BadRequestException('Organization not found');

    // Update org status
    const updatedOrg = await this.prisma.organization.update({
      where: { id: orgId },
      data: { status: 'APPROVED', pendingApproval: false },
    });

    // Get first user of org
    const user = await this.prisma.user.findFirst({ where: { orgId: orgId } });
    if (!user) throw new BadRequestException('No user found for organization');

    // Send approval email
    try {
      await this.mail.sendApprovedEmail(user.email, org.name);
    } catch (err) {
      console.error('sendApprovedEmail failed', err);
    }

    return updatedOrg;
  }
}
