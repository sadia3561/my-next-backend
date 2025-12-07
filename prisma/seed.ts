import { PrismaClient, UserRoleEnum, RegistrationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findFirst({ where: { role: UserRoleEnum.ADMIN } });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        email: "sadiyabepari8@gmail.com",
        username: "admin123",
        password: "$2b$10$g6yqj3wVvb5Uv4H/4fV3Neq/0QDUryLBuZn47CTh/HsfI7bIbtmCO", // hashed (Admin@1234)
        role: UserRoleEnum.ADMIN,
        name: "Admin User",
        status: RegistrationStatus.APPROVED,
      },
    });

    console.log("Admin created:", { email: admin.email, username: admin.username });
  } else {
    console.log("Admin already exists:", { email: existingAdmin.email, username: existingAdmin.username });

    // ⭐ ADDED: Reset admin password
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        password: "$2b$10$g6yqj3wVvb5Uv4H/4fV3Neq/0QDUryLBuZn47CTh/HsfI7bIbtmCO", // new hashed password
      },
    });

    console.log("Admin password reset successfully.");
  }
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
