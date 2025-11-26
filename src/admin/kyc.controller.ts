import { Controller, Get, Param, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { KycService } from '../kyc/kyc.service';

@Controller('admin/kyc')
export class AdminKycController {
  constructor(private readonly kycService: KycService) {}

  @Get('pending')
  async getPendingKyc() {
    try {
      return await this.kycService.kycQueue();
    } catch (error) {
      throw new HttpException('Failed to fetch pending KYC documents', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('approve/:id')
  async approveKyc(@Param('id') id: string) {
    try {
      return await this.kycService.approveKyc(id);
    } catch (error) {
      throw new HttpException('Failed to approve KYC', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reject/:id')
  async rejectKyc(@Param('id') id: string, @Body('note') note?: string) {
    try {
      return await this.kycService.rejectKyc(id, note);
    } catch (error) {
      throw new HttpException('Failed to reject KYC', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
