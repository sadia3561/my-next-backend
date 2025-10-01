import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport'; // ye hona chahiye


@Module({
  imports: [
  PassportModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET || 'supersecretkey',
    signOptions: { expiresIn: '1h' },
  }),
],

  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
