import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // payload.id and payload.role as we sent in login
    const user = await this.prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return null;

    // Only allow approved users
    if (user.status !== 'APPROVED') return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    };
  }
}
