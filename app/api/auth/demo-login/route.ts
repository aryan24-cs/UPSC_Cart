import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, DEMO_ASPIRANT_USER, DEMO_ADMIN_USER } from "@/lib/auth";
import { ensureDatabaseSeeded } from "@/lib/seedHelper";

export async function POST(req: Request) {
  try {
    await ensureDatabaseSeeded(db);
    const body = await req.json().catch(() => ({}));
    const role = body.role || "USER";

    let targetEmail = "demo.user@upsc-cart.local";
    let targetRole = "USER";
    let fallbackUser = DEMO_ASPIRANT_USER;

    if (role === "ADMIN") {
      targetEmail = "demo.admin@upsc-cart.local";
      targetRole = "ADMIN";
      fallbackUser = DEMO_ADMIN_USER;
    }

    let user: any = null;

    try {
      user = await db.user.findFirst({
        where: { email: targetEmail },
      });

      if (!user) {
        user = await db.user.findFirst({
          where: { role: targetRole },
        });
      }

      if (!user) {
        user = await db.user.create({
          data: {
            id: fallbackUser.id,
            name: fallbackUser.name,
            email: targetEmail,
            role: targetRole,
            coachingHub: "Old Rajinder Nagar",
            isVerified: true,
            isMobileVerified: true,
          },
        });
      }
    } catch (dbErr) {
      console.error("Database query failed during demo login, using fallback:", dbErr);
    }

    if (!user) {
      user = fallbackUser;
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
    try {
      const fallback = DEMO_ASPIRANT_USER;
      await createSession(fallback.id);
      return NextResponse.json({
        success: true,
        user: fallback,
        redirect: "/marketplace",
      });
    } catch (fallbackErr) {
      return NextResponse.json(
        { error: "Failed to authenticate demo account." },
        { status: 500 }
      );
    }
  }
}
