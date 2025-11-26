import { Module } from '@nestjs/common';
import { OrgController } from './org.controller';
import { OrgService } from './org.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [MailModule],
  controllers: [OrgController],
  providers: [OrgService, PrismaService, MailService],
  exports: [OrgService],
})
export class OrgModule {}
