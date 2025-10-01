import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [PrismaModule, EventsModule], // PrismaService aur EventService available ho
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
