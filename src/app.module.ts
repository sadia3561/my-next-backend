import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { KycModule } from './kyc/kyc.module';
import { OrgModule } from './org/org.module';
import { AdminModule } from './admin/admin.module';
import { AuditModule } from './audit/audit.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [AuthModule, KycModule, OrgModule, AdminModule, AuditModule, ProfileModule],
  controllers: [AppController],
})
export class AppModule {}
