import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to report" }, { status: 401 });
    }

    const { targetType, targetId, reason, details } = await req.json();
    if (!targetType || !targetId || !reason) {
      return NextResponse.json({ error: "Missing required report fields" }, { status: 400 });
    }

    const report = await db.report.create({
      data: {
        reporterId: user.id,
        targetType,
        targetId,
        reason,
        details,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Report submitted to community moderators. Thank you for keeping UPSC Cart safe.",
      report,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
