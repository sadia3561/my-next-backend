import { Injectable } from '@nestjs/common';
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
      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // ✅ Safely get filenames
      const kycFileName = dto.kycDoc?.filename || null;
      const licenseFileName = dto.licenseDoc?.filename || null;

      // ✅ Check if email already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        return { success: false, message: 'Email already registered' };
      }

      // ✅ Create organisation registration
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

      // ✅ Create user record
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.contactName,
          phone: dto.phone,
          registrations: { connect: { id: registration.id } },
        },
      });

      // ✅ Upload KYC & License files (if available)
      if (dto.kycDoc) {
        await this.kycService.uploadKyc(dto.kycDoc as Express.Multer.File, {
          userId: user.id,
          documentType: dto.kycDoc.mimetype || 'UNKNOWN',
        });
      }

      if (dto.licenseDoc) {
        await this.kycService.uploadKyc(dto.licenseDoc as Express.Multer.File, {
          userId: user.id,
          documentType: 'LICENSE',
        });
      }

      // ✅ Send OTP
      await this.otpService.sendOtp(dto.phone);

      return {
        success: true,
        message: 'Registration created. Please verify OTP to proceed.',
        registrationId: registration.id,
        phone: dto.phone,
      };
    } catch (error) {
      console.error('❌ Error in registerOrg:', error);
      return {
        success: false,
        message: 'Internal server error while registering organisation',
        error: error.message || error,
      };
    }
  }

  async verifyOtp(phone: string, otp: string) {
    const result = await this.otpService.verifyOtp(phone, otp);

    if (!result.success) {
      return { success: false, message: 'Invalid or expired OTP' };
    }

    await this.prisma.partnerRegistration.updateMany({
      where: { phone },
      data: { otpVerified: true, status: RegistrationStatus.VERIFIED },
    });

    return { success: true, message: 'OTP verified successfully!' };
  }
}
