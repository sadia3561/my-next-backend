import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  // 📝 Registration with files (KYC + License)
  @Post('register-org')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'kycDoc', maxCount: 1 },
      { name: 'licenseDoc', maxCount: 1 },
    ]),
  )
  async registerOrg(
    @UploadedFiles()
    files: { kycDoc?: Express.Multer.File[]; licenseDoc?: Express.Multer.File[] },
    @Body() body: any, // FormData comes here
  ) {
    // Attach uploaded files to body
    body.kycDoc = files.kycDoc?.[0];
    body.licenseDoc = files.licenseDoc?.[0];

    // Now call your service
    return this.authService.registerOrg(body);
  }

  // 📱 Send OTP
  @Post('send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.otpService.sendOtp(dto.phone);
  }

  // ✅ Verify OTP
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto.phone, dto.otp);
  }
}
