import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, expectedRole } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password (supports salt:hash or seed salt)
    let isValid = verifyPassword(password, user.password);
    if (!isValid && user.password.startsWith("upsc_salt_secure:")) {
      const crypto = require("crypto");
      const hash = crypto.scryptSync(password, "upsc_salt_secure", 64).toString("hex");
      isValid = user.password === `upsc_salt_secure:${hash}`;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Strict Role Enforcement: If logging in through Admin portal, verify ADMIN role
    if (expectedRole === "ADMIN" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required. This account does not have administrator privileges." },
        { status: 403 }
      );
    }

    await createSession(user.id);

    const { password: _, ...safeUser } = user;
    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
