// src/auth/auth.controller.ts
import { Controller, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterOrgDto } from './dto/register-org.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express'; // ✅ FIXED: imported only needed interceptor

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: { username: string; password: string }) {
    return this.authService.loginWithUsername(dto); // ✅ Already works
  }

  @Post('register')
  async register(@Body() dto: { username: string; password: string; email: string; name?: string }) {
    return this.authService.registerUser(dto); // ✅ Already works
  }

  // ----------------------------- REGISTER ORGANIZATION -----------------------------
  @Post('register-org')
  @UseInterceptors(AnyFilesInterceptor()) // ✅ FIXED: allows multiple files upload from frontend (kycDoc + licenseDoc)
  async registerOrg(
    @UploadedFiles() files: Array<Express.Multer.File>, // ✅ FIXED: correctly typed for multer
    @Body() dto: RegisterOrgDto
  ) {
    console.log("DTO =>", dto); // ✅ DEBUG: frontend form data
    console.log("FILES =>", files); // ✅ DEBUG: uploaded files array

    // Call AuthService to handle full Prisma + business logic
    return this.authService.registerOrg(dto, files); // ✅ FIXED: send DTO + files to service
  }
}
