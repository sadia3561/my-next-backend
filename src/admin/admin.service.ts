import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KycStatus, RegistrationStatus, UserRoleEnum } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // Partner Registrations
  // =========================

  async getAllRegistrations() {
    return this.prisma.partnerRegistration.findMany({
      orderBy: { submittedAt: 'desc' },
    });
  }

  async getRegistrationById(id: string) {
    return this.prisma.partnerRegistration.findUnique({
      where: { id },
    });
  }

  async updateRegistrationStatus(id: string, status: RegistrationStatus) {
    return this.prisma.partnerRegistration.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
      },
    });
  }

  // =========================
  // KYC Documents
  // =========================

  async getQueueItems() {
    return this.prisma.kycDocument.findMany({
      where: { status: KycStatus.PENDING },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateKycStatus(docId: string, status: KycStatus) {
    return this.prisma.kycDocument.update({
      where: { id: docId },
      data: { status },
    });
  }

  // =========================
  // User Management
  // =========================

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: { org: true },
    });
  }

  async updateUserRole(userId: string, role: UserRoleEnum) {
    if (!Object.values(UserRoleEnum).includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }
}
