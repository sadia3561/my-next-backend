// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MailModule, 
    PassportModule.register({ defaultStrategy: 'jwt' }) // ✅ passport JWT setup
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService, // ✅ prisma service injected
    MailService,   // ✅ mail service available
    JwtStrategy    // ✅ JWT strategy provider
  ],
  exports: [
    PassportModule,
    JwtStrategy
  ],
})
export class AuthModule {} // ✅ Module ready for Auth + Org Registration + Email Verification
