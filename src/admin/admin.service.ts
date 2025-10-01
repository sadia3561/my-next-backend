import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  private roles = [
    { id: 'admin', permissions: ['*'] },
    { id: 'user', permissions: ['read:profile'] },
  ];

  async getRoles() {
    return this.roles;
  }

  async createRole(body: any) {
    const newRole = { id: body.id, permissions: body.permissions || [] };
    this.roles.push(newRole);
    return { message: 'Role created', role: newRole };
  }

  async updateRole(body: any) {
    const role = this.roles.find((r) => r.id === body.id);
    if (!role) return { message: 'Role not found' };

    role.permissions = body.permissions;
    return { message: 'Role updated', role };
  }
}
