import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();

    const room = await db.roomListing.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        location: true,
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            isVerified: true,
            coachingHub: true,
            responseTime: true,
            responseRate: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room listing not found" }, { status: 404 });
    }

    const isOwner = user?.id === room.ownerId;

    return NextResponse.json({
      room: {
        ...room,
        images: JSON.parse(room.images || "[]"),
        amenitiesList: room.amenities ? room.amenities.split(",").map((s) => s.trim()) : [],
        isOwner,
      },
    });
  } catch (error) {
    console.error("Error fetching room details:", error);
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 });
  }
}
