//src/admin/invite.controller.ts
//import { prisma } from "../lib/prisma";

//export async function createInvite({ email, orgId, role, expiresAt }: {
  //email: string;
  //orgId: string;
  //role: "SUPER_ADMIN" | "ORG_ADMIN" | "USER";
  //expiresAt: Date;
//}) {
  //const token = crypto.randomUUID();

  //const invite = await prisma.invite.create({
    //data: {
      //email, 
      //token, 
      //orgId,
      //role,
      //expiresAt,
    //},
  //});

  //return invite;
//}
import { Controller, Get, Post } from '@nestjs/common';

@Controller('invite')
export class InviteController {

  @Get()
  getAll() {
    return 'All invites route working';
  }

  @Post()
  create() {
    return 'Create invite route working';
  }
}
