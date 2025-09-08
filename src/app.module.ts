import { Module } from '@nestjs/common';
import { RegistrationModule } from './registration/registration.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [RegistrationModule],
  providers: [PrismaService],
})
export class AppModule {}
