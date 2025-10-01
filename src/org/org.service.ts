import { Injectable } from '@nestjs/common';

@Injectable()
export class OrgService {
  async getOrgProfile() {
    // fetch from DB with Prisma
    return {
      orgId: 'org_123',
      name: 'Demo Organization',
      gstin: '22AAAAA0000A1Z5',
      verified: false,
    };
  }

  async updateOrgProfile(body: any) {
    // update org record in DB
    return {
      message: 'Org profile updated',
      data: body,
    };
  }
}
