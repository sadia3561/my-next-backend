import { PrismaClient, UserRoleEnum, RegistrationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findFirst({ where: { role: UserRoleEnum.ADMIN } });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        email: "sadiyabepari8@gmail.com",
        username: "admin123",
        password: "$2b$10$psMTspd7APO/QoPxDnKynOJxbOGUsxMd1f3VXxijv5WgJFztM03JG", // hashed
        role: UserRoleEnum.ADMIN,
        name: "Admin User",
        status: RegistrationStatus.APPROVED,
      },
    });

    console.log("Admin created:", { email: admin.email, username: admin.username });
  } else {
    console.log("Admin already exists:", { email: existingAdmin.email, username: existingAdmin.username });
  }
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
