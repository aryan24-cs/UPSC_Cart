import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isVerified: true,
        isMobileVerified: true,
        bio: true,
        coachingHub: true,
        optionalSubject: true,
        targetYear: true,
        responseRate: true,
        responseTime: true,
        createdAt: true,
        _count: {
          select: {
            listings: true,
            favorites: true,
            reviewsReceived: true,
          },
        },
      },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: fullUser });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      phone,
      bio,
      coachingHub,
      optionalSubject,
      targetYear,
      avatar,
    } = body;

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(bio !== undefined && { bio: bio.trim() }),
        ...(coachingHub !== undefined && { coachingHub: coachingHub.trim() }),
        ...(optionalSubject !== undefined && { optionalSubject: optionalSubject.trim() }),
        ...(targetYear !== undefined && { targetYear: parseInt(targetYear, 10) || null }),
        ...(avatar !== undefined && { avatar: avatar.trim() }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isVerified: true,
        isMobileVerified: true,
        bio: true,
        coachingHub: true,
        optionalSubject: true,
        targetYear: true,
        responseRate: true,
        responseTime: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
