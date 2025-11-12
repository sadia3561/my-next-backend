import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KycModule } from '../kyc/kyc.module';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';



@Module({
  imports: [
    PrismaModule,
    KycModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret', // ✅ add your JWT secret
      signOptions: { expiresIn: '1d' }, // ✅ optional
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,OtpService],
  exports: [JwtModule, AuthService,OtpService],
})
export class AuthModule {}
