import { Controller, Get, Put, Body } from '@nestjs/common';
import { OrgService } from './org.service';

@Controller('api/org/profile')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @Get()
  async getOrgProfile() {
    return this.orgService.getOrgProfile();
  }

  @Put()
  async updateOrgProfile(@Body() body: any) {
    return this.orgService.updateOrgProfile(body);
  }
}
