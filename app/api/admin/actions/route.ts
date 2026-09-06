import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required. You don't have permission to perform administrative actions." },
        { status: 403 }
      );
    }

    const { action, targetId, value } = await req.json();

    if (action === "UPDATE_LISTING_STATUS") {
      const listing = await db.listing.update({
        where: { id: targetId },
        data: { status: value },
      });
      return NextResponse.json({ success: true, listing });
    }

    if (action === "RESOLVE_REPORT") {
      const report = await db.report.update({
        where: { id: targetId },
        data: { status: value || "RESOLVED" },
      });
      return NextResponse.json({ success: true, report });
    }

    if (action === "TOGGLE_USER_VERIFIED") {
      const targetUser = await db.user.findUnique({ where: { id: targetId } });
      if (!targetUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const updated = await db.user.update({
        where: { id: targetId },
        data: { isVerified: !targetUser.isVerified },
      });
      return NextResponse.json({ success: true, user: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin action error:", error);
    return NextResponse.json({ error: "Failed to perform admin action" }, { status: 500 });
  }
}
