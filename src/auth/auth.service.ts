// src/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterOrgDto } from './dto/register-org.dto';
import { Express } from 'express';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // -----------------------------
  // REGISTER USER (email required)
  // -----------------------------
  async registerUser(dto: {
    username: string;
    password: string;
    email: string;
    name?: string;
  }) {
    const usernameExists = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (usernameExists) {
      throw new BadRequestException('Username already taken');
    }

    const emailExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashed,
        email: dto.email,
        name: dto.name || null,
        status: 'PENDING',
      },
    });

    return { message: 'User registered successfully', user };
  }

  // -----------------------------
  // LOGIN WITH USERNAME ONLY
  // -----------------------------
  async loginWithUsername(dto: { username: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (user.status !== 'APPROVED') {
      throw new UnauthorizedException('Your account is not approved yet');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      message: 'Login successful',
      token,
      user,
    };
  }

  // -----------------------------
  // OPTIONAL: Admin-only pending approval fetch
  // -----------------------------
  async getPendingUsers(adminId: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied');
    }

    return this.prisma.user.findMany({
      where: { status: 'PENDING' },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }

  // -----------------------------
  // OPTIONAL: Admin approve/reject user
  // -----------------------------
  async updateUserStatus(
    adminId: string,
    userId: string,
    status: 'APPROVED' | 'REJECTED'
  ) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.orgId) {
      await this.prisma.organization.update({
        where: { id: user.orgId },
        data: { status },
      });
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  }

  // -----------------------------
  // REGISTER ORGANIZATION + SYNC SUPABASE
  // -----------------------------
  async registerOrg(dto: RegisterOrgDto, files: Array<Express.Multer.File>) {
    console.log('DTO RECEIVED:', dto);
    console.log('FILES RECEIVED:', files);

    // GSTIN duplicate check
    if (dto.gstin) {
      const gstExist = await this.prisma.organization.findUnique({
        where: { gstin: dto.gstin },
      });
      if (gstExist) {
        throw new BadRequestException('Organization with this GSTIN already exists');
      }
    }

    // STEP 1: Create Organization in Prisma
    const org = await this.prisma.organization.create({
      data: {
        name: dto.orgName ?? dto.contactName ?? 'NoName',
        gstin: dto.gstin || null,
        address: dto.address,
        status: 'PENDING',
        legalName: null,
        website: dto.website || null,
        industry: dto.businessType,
      },
    });


      // STEP 2: Handle uploaded files (KYC & License) ✅ ADDED
    let kycFileUrl: string | null = null;
    let licenseFileUrl: string | null = null;

    if (files && files.length > 0) {
      for (const file of files) {
        if (file.fieldname === 'kycDoc') kycFileUrl = `/uploads/${file.filename}`; // ✅ save KYC URL
        if (file.fieldname === 'licenseDoc') licenseFileUrl = `/uploads/${file.filename}`; // ✅ save License URL
      }
    }

    // STEP 3: Create PartnerRegistration in Prisma ✅ ADDED
    const hashedPassword = await bcrypt.hash(dto.password, 10); // ✅ hash password

    const partnerReg = await this.prisma.partnerRegistration.create({
      data: {
        orgName: dto.orgName,
        gstin: dto.gstin || null,
        address: dto.address,
        contactName: dto.contactName,
        designation: dto.designation || null,
        email: dto.email,
        phone: dto.phone,
        website: dto.website || null,
        businessType: dto.businessType,
        experience: dto.experience,
        kycDocUrl: kycFileUrl, // ✅ saved KYC file URL
        licenseDocUrl: licenseFileUrl, // ✅ saved License file URL
        description: dto.description || null,
        username: dto.username,
        passwordHash: hashedPassword, // ✅ hashed password
        status: 'PENDING',
      },
    });

    // STEP 2: Create Admin User in Prisma
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        email: dto.email,
        name: dto.contactName,
        role: 'USER',
        status: 'PENDING',
        orgId: org.id,
      },
    });

  
    

    return {
      message: 'Organization registered successfully. Wait for approval.',
      org,
      user,
      partnerReg,
      uploadedFiles: files ?? [],
    };
  }
}
