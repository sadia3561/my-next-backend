import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class AuditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
  ) {}

  /**
   * Logs an audit event in the database and publishes it via RabbitMQ.
   * @param userId - User ID (nullable for system events)
   * @param action - Action performed
   * @param meta - Additional metadata
   */
  async log(userId: string | null, action: string, meta: any) {
    // Create audit log in DB
    const ev = await this.prisma.auditLog.create({
      data: {
        action,           // string
        ...(userId ? { userId } : {}),
    ...(meta ? { metadata: meta } : {}),
      },
    });

    // Publish event to RabbitMQ
    await this.events.publish('audit.logged', {
      id: ev.id,
      userId,
      action,
      meta,
    });

    return ev;
  }
  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' } as any,
    });
  }
}
