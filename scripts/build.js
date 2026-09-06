const { execSync } = require("child_process");

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const env = { ...process.env, DATABASE_URL: dbUrl };

console.log("UPSC Cart Build Step initialized.");
console.log("Using DATABASE_URL:", dbUrl);

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit", env });
}

try {
  run("npx prisma generate");
  run("npx prisma db push --accept-data-loss");
  run("npx tsx prisma/seed.ts");
  run("next build");
} catch (err) {
  console.error("Build execution failed:", err);
  process.exit(1);
}
