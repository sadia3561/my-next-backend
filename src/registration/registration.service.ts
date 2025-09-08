import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegistrationService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; email: string }) {
    return this.prisma.registration.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.registration.findMany();
  }
}
