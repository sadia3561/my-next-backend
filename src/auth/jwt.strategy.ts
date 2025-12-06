// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set'); // ✅ Ensure JWT_SECRET is configured
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ✅ Extract JWT from Bearer token
      secretOrKey: secret,
      ignoreExpiration: false, // ✅ Enforce token expiration
    });
  }

  async validate(payload: any) {
    // payload contains id and role sent during login
    const user = await this.prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) return null; // ✅ Return null if user not found (passport will reject)

    if (user.status !== 'APPROVED') return null; // ✅ Only approved users allowed

    // ✅ Return minimal user info to attach to request object
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    };
  }
}
