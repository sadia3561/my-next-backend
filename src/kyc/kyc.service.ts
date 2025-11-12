import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
type KycStatus = 'SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
import { PrismaService } from '../prisma/prisma.service'; 

import { UploadKycDto } from './dto/kyc-upload.dto';

const prisma = new PrismaClient();

@Injectable()
export class KycService {
  // =========================
  // Single KYC Upload
  // =========================
  constructor(private prisma: PrismaService) {}
  async uploadKyc(file: Express.Multer.File, body: UploadKycDto) {
    if (!body.userId || !body.documentType) {
      throw new Error('Missing required fields for KYC upload');
    }

    const kycDoc = await prisma.kycDocument.create({
      data: {
        userId: body.userId,
        documentType: body.documentType,
        url: file.path || file.filename, // use path if stored on disk, filename if in memory
        status: 'PENDING',
      },
    });

    return kycDoc;
  }

  // =========================
  // Multiple KYC Upload
  // =========================
  async uploadMultipleKyc(files: Express.Multer.File[], body: UploadKycDto) {
    const uploadedDocs: any[] = []; // ✅ makes it type-safe

    for (const file of files) {
      const doc = await this.uploadKyc(file, body);
      uploadedDocs.push(doc);
    }
    return uploadedDocs;
  }


  async kycQueue() {
  return await this.prisma.kycDocument.findMany({
    where: { status: 'PENDING' },
    orderBy: [{ createdAt: 'desc' }],

  });
}


  // =========================
  // Approve a KYC document
  // =========================
  async approveKyc(id: string) {
    return prisma.kycDocument.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  // =========================
  // Reject a KYC document
  // =========================
  async rejectKyc(id: string, note?: string) {
    return prisma.kycDocument.update({
      where: { id },
      data: { status: 'REJECTED', note: note || null },
    });
  }

  // =========================
  // Get KYC documents by user ID
  // =========================
  async getKycByUser(userId: string) {
    return prisma.kycDocument.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }],

    });
  }

  // =========================
  // Get all KYC documents (admin)
  // =========================
  async getAllKyc() {
    return prisma.kycDocument.findMany({
      orderBy: [{ createdAt: 'desc' }],

    });
  }
}
