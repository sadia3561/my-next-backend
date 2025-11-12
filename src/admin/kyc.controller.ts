// src/admin/kyc.controller.ts
import { Controller, Get, Param, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { KycService } from '../kyc/kyc.service';

@Controller('admin/kyc')
export class AdminKycController {
  constructor(private readonly kycService: KycService) {}

  // GET all pending KYC documents for admin review
  @Get('pending')
  async getPendingKyc() {
    try {
      return await this.kycService.kycQueue(); // fetch pending KYCs
    } catch (error) {
      throw new HttpException('Failed to fetch pending KYC documents', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // POST approve KYC by id
  @Post('approve/:id')
  async approveKyc(@Param('id') id: string) {
    try {
      return await this.kycService.approveKyc(id);
    } catch (error) {
      throw new HttpException('Failed to approve KYC', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // POST reject KYC by id
  @Post('reject/:id')
  async rejectKyc(@Param('id') id: string, @Body('note') note?: string) {
    try {
      return await this.kycService.rejectKyc(id, note);
    } catch (error) {
      throw new HttpException('Failed to reject KYC', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
