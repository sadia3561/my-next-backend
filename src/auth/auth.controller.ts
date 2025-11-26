// src/auth/auth.controller.ts
import { Controller, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterOrgDto } from './dto/register-org.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';


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

 @Post("register-org")
@UseInterceptors(AnyFilesInterceptor())
async registerOrg(
  @UploadedFiles() files: Array<Express.Multer.File>,
  @Body() dto: RegisterOrgDto
) {
  console.log("DTO RECEIVED =>", dto);
  console.log("FILES RECEIVED =>", files);

  return this.authService.registerOrg(dto, files);
}

}
