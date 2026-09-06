import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await db.favorite.findMany({
      where: { userId: user.id },
      include: {
        listing: {
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            category: true,
            location: true,
            seller: {
              select: {
                id: true,
                name: true,
                avatar: true,
                isVerified: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      favorites: favorites.map((f) => ({
        ...f.listing,
        isFavorited: true,
      })),
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to save items" }, { status: 401 });
    }

    const { listingId } = await req.json();
    if (!listingId) {
      return NextResponse.json({ error: "Listing ID required" }, { status: 400 });
    }

    const existing = await db.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: user.id,
          listingId,
        },
      },
    });

    if (existing) {
      await db.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ favorited: false });
    } else {
      await db.favorite.create({
        data: {
          userId: user.id,
          listingId,
        },
      });

      // Optionally notify seller
      const listing = await db.listing.findUnique({
        where: { id: listingId },
      });
      if (listing && listing.sellerId !== user.id) {
        await db.notification.create({
          data: {
            userId: listing.sellerId,
            type: "FAVORITE",
            title: "Item Saved",
            message: `${user.name} saved your item "${listing.title}".`,
            link: `/listing/${listing.slug}`,
          },
        });
      }

      return NextResponse.json({ favorited: true });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json({ error: "Failed to update favorite" }, { status: 500 });
  }
}
