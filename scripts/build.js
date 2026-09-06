const { execSync } = require("child_process");

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const env = { ...process.env, DATABASE_URL: dbUrl };

console.log("UPSC Cart Build Step initialized.");
console.log("Using DATABASE_URL:", dbUrl);

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
safeRun("npx tsx prisma/seed.ts");
run("next build");
