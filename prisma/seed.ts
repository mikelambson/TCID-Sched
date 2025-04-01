import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import readline from 'readline';
import readlineSync from 'readline-sync';

const prisma = new PrismaClient();

// Standard prompt
const ask = (question: string, defaultValue = ""): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(`${question}${defaultValue ? ` (default: "${defaultValue}")` : ""}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    })
  );
};

// Create admin flow
async function createAdminFlow() {
  const existingAdmin = await prisma.user.findFirst({
    where: { isAdmin: true },
  });

  if (existingAdmin) {
    console.log(`⚠️ Admin already exists: ${existingAdmin.email}`);
    const confirm = await ask("Do you want to create another admin user? (y/N)", "N");
    if (!/^y(es)?$/i.test(confirm)) {
      console.log("Skipping additional admin creation.");
      return;
    }
  }

  const name = await ask("New admin name", "Admin");
  const email = await ask("New admin email", "admin@example.com");

  let passwordRaw = "";
  while (true) {
    const pass1 = readlineSync.question("New admin password: ", {
      hideEchoBack: true,
      mask: "*",
    });
    const pass2 = readlineSync.question("Confirm password: ", {
      hideEchoBack: true,
      mask: "*",
    });

    if (pass1 !== pass2) {
      console.log("❌ Passwords do not match. Try again.\n");
    } else if (pass1.length < 6) {
      console.log("❌ Password must be at least 6 characters.\n");
    } else {
      passwordRaw = pass1;
      break;
    }
  }

  const hashedPassword = await argon2.hash(passwordRaw);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log(`✅ Admin user created: ${email}`);
}

// Reset password flow
async function resetPasswordByEmail() {
  const email = await ask("Please enter email to reset password");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log(`❌ No user found with email: ${email}`);
    return;
  }

  console.log(`👤 Found user: ${user.name || "Unnamed"} (${email})`);

  let passwordRaw = "";
  while (true) {
    const pass1 = readlineSync.question("New password: ", {
      hideEchoBack: true,
      mask: "*",
    });
    const pass2 = readlineSync.question("Confirm password: ", {
      hideEchoBack: true,
      mask: "*",
    });

    if (pass1 !== pass2) {
      console.log("❌ Passwords do not match. Try again.\n");
    } else if (pass1.length < 6) {
      console.log("❌ Password must be at least 6 characters.\n");
    } else {
      passwordRaw = pass1;
      break;
    }
  }

  const hashedPassword = await argon2.hash(passwordRaw);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log(`✅ Password updated successfully for: ${email}`);
}

// Entry point
async function main() {
  const args = process.argv.slice(2);

  const isReset = args.includes("--reset") || args.includes("reset");

  if (isReset) {
    await resetPasswordByEmail();
  } else {
    await createAdminFlow();
  }
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
