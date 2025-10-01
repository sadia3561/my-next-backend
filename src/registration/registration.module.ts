import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PrismaService],
  providers: [PrismaService, PrismaService],
})
export class PrismaModule {}

