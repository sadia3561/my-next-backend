// src/auth/auth.controller.ts
import { Controller, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterOrgDto } from './dto/register-org.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import supabase from '../supabase/supabase.client'; // Supabase client imported

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: { username: string; password: string }) {
    return this.authService.loginWithUsername(dto);
  }

  @Post('register')
  async register(@Body() dto: { username: string; password: string; email: string; name?: string }) {
    return this.authService.registerUser(dto);
  }

  @Post('register-org')
  @UseInterceptors(AnyFilesInterceptor())
  async registerOrg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: RegisterOrgDto
  ) {
    console.log('DTO RECEIVED =>', dto);
    console.log('FILES RECEIVED =>', files);

    // Use Supabase to insert organization (optional, in addition to Prisma)
    const { data, error } = await supabase.from('organizations').insert({
      org_name: dto.orgName,
      email: dto.email,
      username: dto.username,
      password: dto.password, // In production, hash passwords
      contact_name: dto.contactName,
      phone: dto.phone,
      address: dto.address,
      business_type: dto.businessType,
      experience: dto.experience,
      gstin: dto.gstin || null,
      kyc_document_url: dto.kycDocumentUrl || null,
      designation: dto.designation || null,
      website: dto.website || null,
      description: dto.description || null,
    });

    if (error) {
      console.error('Supabase insert error:', error);
      // optional: continue with Prisma insert anyway
    }

    // Call AuthService to handle full Prisma + business logic
    return this.authService.registerOrg(dto, files);
  }
}
