// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post('register-org')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'kycDoc', maxCount: 1 },
        { name: 'licenseDoc', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/kyc', // ensure this folder exists
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fileExt = extname(file.originalname);
            callback(null, `${uniqueSuffix}${fileExt}`);
          },
        }),
      },
    ),
  )
  async registerOrg(
    @UploadedFiles()
    files: { kycDoc?: Express.Multer.File[]; licenseDoc?: Express.Multer.File[] },
    @Body() body: any,
  ) {
    // Attach uploaded files (if any) to body as objects with filename/path
    if (files?.kycDoc?.[0]) {
      body.kycDoc = files.kycDoc[0]; // contains filename, path, mimetype, etc
    }
    if (files?.licenseDoc?.[0]) {
      body.licenseDoc = files.licenseDoc[0];
    }

    return this.authService.registerOrg(body);
  }

  // ... other endpoints
}
