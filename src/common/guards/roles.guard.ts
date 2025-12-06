// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // ✅ Get the roles required for this route from @Roles() decorator
    const requiredRoles = this.reflector.get<UserRoleEnum[]>('roles', context.getHandler());

    // ✅ If no roles are specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // ✅ Get the user object attached by JwtStrategy
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // ✅ If no user or user role not allowed, throw forbidden
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    // ✅ User has required role, allow access
    return true;
  }
}
