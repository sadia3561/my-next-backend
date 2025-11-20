import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadKycDto } from './dto/kyc-upload.dto';
import { KycDocument } from '@prisma/client';
import { Express } from 'express';

@Injectable()
export class KycService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // Validate file type
  // =========================
  private validateFile(file: Express.Multer.File) {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type: ${file.originalname}`);
    }
  }

  // =========================
  // Single KYC Upload
  // =========================
  async uploadKyc(file: Express.Multer.File, body: UploadKycDto): Promise<KycDocument> {
    if (!body.userId || !body.documentType) {
      throw new BadRequestException('Missing required fields for KYC upload');
    }

    this.validateFile(file);

    const kycDoc = await this.prisma.kycDocument.create({
      data: {
        userId: body.userId,
        documentType: body.documentType,
        url: file.path || file.filename, // file storage path
        status: 'PENDING',
      },
    });

    return kycDoc;
  }

  // =========================
  // Multiple KYC Upload
  // =========================
  async uploadMultipleKyc(files: Express.Multer.File[], body: UploadKycDto): Promise<KycDocument[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided for KYC upload');
    }

    const uploadedDocs: KycDocument[] = [];

    for (const file of files) {
      const doc = await this.uploadKyc(file, body);
      uploadedDocs.push(doc);
    }

    return uploadedDocs;
  }

  // =========================
  // Get all pending KYC documents
  // =========================
  async kycQueue(): Promise<KycDocument[]> {
    return this.prisma.kycDocument.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
  }

  // =========================
  // Approve a KYC document
  // =========================
  async approveKyc(id: string): Promise<KycDocument> {
    return this.prisma.kycDocument.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  // =========================
  // Reject a KYC document
  // =========================
  async rejectKyc(id: string, note?: string): Promise<KycDocument> {
    return this.prisma.kycDocument.update({
      where: { id },
      data: { status: 'REJECTED', note: note || null },
    });
  }

  // =========================
  // Get KYC documents by user ID
  // =========================
  async getKycByUser(userId: string): Promise<KycDocument[]> {
    return this.prisma.kycDocument.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // =========================
  // Get all KYC documents (admin)
  // =========================
  async getAllKyc(): Promise<KycDocument[]> {
    return this.prisma.kycDocument.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
