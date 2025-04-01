// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Check if an admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { isAdmin: true },
  });

  if (!existingAdmin) {
    // Seed initial admin user
    const hashedPassword = await argon2.hash('admin123'); // Change this password!
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true,
      },
    });
    console.log('Initial admin user created: admin@example.com / admin123');
  } else {
    console.log('Admin user already exists, skipping seed.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });