// profile.controller.ts
import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateProfileDto } from '../auth/dto/profile.dto';
import { GetUser } from '../common/decorators/user.decorator';


@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@GetUser('id') userId: string) {
    return this.profileService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(userId, dto);
  }
  
}
