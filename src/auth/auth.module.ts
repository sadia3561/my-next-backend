import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';




@Module({
  imports: [MailModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, MailService, JwtStrategy],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
