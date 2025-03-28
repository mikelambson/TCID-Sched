#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

function ensureEnv(fileName) {
  const example = `${fileName}.example`;
  if (!fs.existsSync(fileName) && fs.existsSync(example)) {
    fs.copyFileSync(example, fileName);
    console.log(`🪄 Created ${fileName} from ${example}`);
  }
}

console.log("📁 Setting up environment files...");
ensureEnv(".env");
ensureEnv(".env.local");

console.log("📦 Installing dependencies...");
execSync("npm install", { stdio: "inherit" });

console.log("🧙 Generating Prisma client...");
execSync("npx prisma generate", { stdio: "inherit" });

// Optionally add:
try {
  console.log("📜 Running DB migration...");
  execSync("npx prisma migrate dev --name init", { stdio: "inherit" });
} catch {
  console.log("⚠️ Migration skipped or already applied");
}

console.log("✅ Setup complete. Run: npm run dev");
