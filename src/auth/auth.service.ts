import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterOrgDto } from './dto/register-org.dto';
import * as bcrypt from 'bcrypt';
import { KycService } from '../kyc/kyc.service';
import { OtpService } from './otp.service';
import type { Express } from 'express';

export enum RegistrationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kycService: KycService,
    private readonly otpService: OtpService,
  ) {}

  async registerOrg(dto: RegisterOrgDto) {
    try {
      // 🟦 PASSWORD HASH
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // 🟦 FILE NAMES FROM MULTER
      const kycDoc = dto.kycDoc as Express.Multer.File;
      const licenseDoc = dto.licenseDoc as Express.Multer.File;

      const kycFileName = kycDoc?.filename || null;
      const licenseFileName = licenseDoc?.filename || null;

      // 🟦 DUPLICATE EMAIL CHECK
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already registered');
      }

      // 🟦 CREATE PARTNER REGISTRATION ENTRY
      const registration = await this.prisma.partnerRegistration.create({
        data: {
          orgName: dto.orgName,
          gstin: dto.gstin,
          address: dto.address,
          kycDocUrl: kycFileName,
          contactName: dto.contactName,
          designation: dto.designation,
          email: dto.email,
          phone: dto.phone,
          otpVerified: false,
          website: dto.website,
          businessType: dto.businessType,
          experience: dto.experience,
          licenseDocUrl: licenseFileName,
          description: dto.description,
          username: dto.username,
          passwordHash: hashedPassword,
          status: RegistrationStatus.PENDING,
        },
      });

      // 🟦 CREATE USER RECORD
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.contactName,
          phone: dto.phone,
          registrations: { connect: { id: registration.id } },
        },
      });

      // 🟦 SAVE KYC DOCS IN KycDocument TABLE (only once)
      if (kycDoc) {
        await this.kycService.uploadKyc(kycDoc, {
          userId: user.id,
          documentType: 'KYC',
        });
      }

      if (licenseDoc) {
        await this.kycService.uploadKyc(licenseDoc, {
          userId: user.id,
          documentType: 'LICENSE',
        });
      }

      // 🟦 SEND OTP
      await this.otpService.sendOtp(dto.phone);

      return {
        success: true,
        message: 'Registration successful, verify OTP.',
        registrationId: registration.id,
        phone: dto.phone,
      };
    } catch (error) {
      console.error('❌ Registration Error:', error);
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }

  async verifyOtp(phone: string, otp: string) {
    const result = await this.otpService.verifyOtp(phone, otp);

    if (!result.success) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.partnerRegistration.updateMany({
      where: { phone },
      data: { otpVerified: true, status: RegistrationStatus.VERIFIED },
    });

    return { success: true, message: 'OTP verified successfully!' };
  }
}
