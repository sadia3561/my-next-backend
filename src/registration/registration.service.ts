//src/registration/registration.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class user {
  constructor(private prisma: PrismaService) {}

  async create(data: {username: string; name: string; email: string; password: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }
}
