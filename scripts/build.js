const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Load .env if present
try {
  if (typeof process.loadEnvFile === "function") {
    process.loadEnvFile(path.join(__dirname, "../.env"));
  }
} catch (e) {}

const dbUrl = process.env.DATABASE_URL;
const env = { ...process.env };

console.log("UPSC Cart Build Step initialized.");
console.log("Using Database:", dbUrl ? "Remote / Configured" : "Default");

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit", env });
}

function safeRun(cmd) {
  try {
    console.log(`\n> ${cmd}`);
    execSync(cmd, { stdio: "inherit", env });
  } catch (err) {
    console.warn(`Warning: '${cmd}' failed. Proceeding with runtime auto-seeding fallbacks.`);
  }
}

safeRun("npx prisma generate");
safeRun("npx prisma db push --accept-data-loss --skip-generate");
if (process.env.SEED_ON_BUILD === "true") {
  safeRun("npx tsx prisma/seed.ts");
}
run("next build");
