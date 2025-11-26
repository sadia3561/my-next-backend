import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async getPendingOrgs() {
    const orgs = await this.prisma.organization.findMany({
      where: { pendingApproval: true },
      include: {
        users: { select: { id: true, email: true, name: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map for frontend convenience
    return orgs.map((o) => ({
      id: o.id,
      name: o.name,
      gstin: o.gstin,
      website: o.website,
      industry: o.industry,
      createdAt: o.createdAt,
      users: o.users,
    }));
  }

  async approveOrg(orgId: string) {
    const org = await this.prisma.organization.findUnique({ where: { id: orgId }, include: { users: true } });
    if (!org) throw new NotFoundException('Organization not found');

    await this.prisma.organization.update({
      where: { id: orgId },
      data: { pendingApproval: false, status: 'APPROVED' },
    });

    // approve all users under org (typically only one)
    const users = org.users || [];
    for (const u of users) {
      await this.prisma.user.update({
        where: { id: u.id },
        data: { status: 'APPROVED' },
      });
      // send approved email
      await this.mail.sendApprovedEmail(u.email, org.name);
    }

    // audit
    await this.prisma.auditLog.create({
      data: {
        action: 'ORG_APPROVED',
        metadata: { orgId },
      },
    });

    return { message: 'Organization approved' };
  }

  async rejectOrg(orgId: string) {
    const org = await this.prisma.organization.findUnique({ where: { id: orgId }, include: { users: true } });
    if (!org) throw new NotFoundException('Organization not found');

    await this.prisma.organization.update({
      where: { id: orgId },
      data: { pendingApproval: false, status: 'REJECTED' },
    });

    // optionally update users status
    for (const u of org.users) {
      await this.prisma.user.update({
        where: { id: u.id },
        data: { status: 'REJECTED' },
      });
    }

    await this.prisma.auditLog.create({
      data: {
        action: 'ORG_REJECTED',
        metadata: { orgId },
      },
    });

    return { message: 'Organization rejected' };
  }
}
