const { execSync } = require("child_process");

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const env = { ...process.env, DATABASE_URL: dbUrl };

try {
  execSync("npx prisma generate", { stdio: "inherit", env });
} catch (err) {
  console.log("Postinstall notice:", err.message);
}
