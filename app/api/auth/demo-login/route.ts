import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { role } = await req.json();

    let targetEmail = "demo.user@upsc-cart.local";
    let targetRole = "USER";

    if (role === "ADMIN") {
      targetEmail = "demo.admin@upsc-cart.local";
      targetRole = "ADMIN";
    }

    let user = await db.user.findFirst({
      where: { email: targetEmail },
    });

    // Fallback search by role if dedicated demo email wasn't found
    if (!user) {
      user = await db.user.findFirst({
        where: { role: targetRole },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: `Demo ${role} account not found in database.` },
        { status: 404 }
      );
    }

    // Strict safety check: ensure the retrieved user actually possesses targetRole
    if (role === "ADMIN" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Security violation: Account does not have ADMIN permissions." },
        { status: 403 }
      );
    }

    await createSession(user.id);

    const { password: _, ...safeUser } = user;
    return NextResponse.json({
      success: true,
      user: safeUser,
      redirect: user.role === "ADMIN" ? "/admin" : "/marketplace",
    });
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate demo account." },
      { status: 500 }
    );
  }
}
