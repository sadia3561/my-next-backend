// src/kyc/kyc.controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { KycService } from './kyc.service';
import { UploadKycDto } from './dto/kyc-upload.dto';
import type { Express } from 'express';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  // =========================
  // Single KYC upload
  // =========================
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadKyc(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadKycDto,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    try {
      const result = await this.kycService.uploadKyc(file, body);
      return { message: 'KYC uploaded successfully', kyc: result };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =========================
  // Multiple KYC upload
  // =========================
  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleKyc(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UploadKycDto,
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }
    try {
      const uploadedDocs = await this.kycService.uploadMultipleKyc(files, body);
      return { message: 'KYC documents uploaded successfully', kyc: uploadedDocs };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =========================
  // Get KYC documents by user
  // =========================
  @Get('user/:userId')
  async getKycByUser(@Param('userId') userId: string) {
    try {
      const docs = await this.kycService.getKycByUser(userId);
      return { kyc: docs };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =========================
  // Get all KYC documents (admin)
  // =========================
  @Get('all')
  async getAllKyc() {
    try {
      const docs = await this.kycService.getAllKyc();
      return { kyc: docs };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =========================
  // Approve a KYC document
  // =========================
  @Patch('approve/:id')
  async approveKyc(@Param('id') id: string) {
    try {
      const result = await this.kycService.approveKyc(id);
      return { message: 'KYC approved', kyc: result };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =========================
  // Reject a KYC document
  // =========================
  @Patch('reject/:id')
  async rejectKyc(@Param('id') id: string, @Body('note') note?: string) {
    try {
      const result = await this.kycService.rejectKyc(id, note);
      return { message: 'KYC rejected', kyc: result };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
