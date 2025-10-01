import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { KycService } from './kyc.service';

@Controller('api/kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('upload')
  async uploadKyc(@Body() body: any) {
    return this.kycService.uploadKyc(body);
  }
}

@Controller('api/admin/kyc')
export class AdminKycController {
  constructor(private readonly kycService: KycService) {}

  @Get('queue')
  async kycQueue() {
    return this.kycService.kycQueue();
  }

  @Patch('approve/:id')
  async approve(@Param('id') id: string) {
    return this.kycService.approveKyc(id);
  }

  @Patch('reject/:id')
  async reject(@Param('id') id: string, @Body() body: any) {
    return this.kycService.rejectKyc(id, body.note);
  }
}
