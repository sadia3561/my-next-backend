import { PrismaClient, UserRoleEnum, RegistrationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  // NEW ADMIN DETAILS
  const adminEmail = "sadiyabepari8@gmail.com";

  // Check if admin already exists (safety check)
  const existing = await prisma.user.findFirst({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log("Admin already exists. Skipping create.");
    return;
  }

  // Create NEW admin
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      username: "admin123",
      password:
        "$2b$10$uCdfnoMYnH6yROKUbi3cqeOYOZ3RtZ78GdU21w5v.h6F7pGFnjEFi", // password = admin123
      role: UserRoleEnum.ADMIN,
      name: "Admin User",
      status: RegistrationStatus.APPROVED,
    },
  });

  console.log("✅ New admin created:", {
    email: admin.email,
    username: admin.username,
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
