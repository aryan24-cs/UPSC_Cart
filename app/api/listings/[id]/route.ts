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

    // Check by id or slug
    const listing = await db.listing.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        location: true,
        seller: {
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
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
        offers: {
          where: user ? { buyerId: user.id } : undefined,
          orderBy: { createdAt: "desc" },
        },
        favorites: user ? { where: { userId: user.id } } : false,
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Increment view count asynchronously
    await db.listing.update({
      where: { id: listing.id },
      data: { views: { increment: 1 } },
    });

    // Mask phone number for privacy as requested in prompt (show only last 4 or verified tag)
    const isOwner = user?.id === listing.sellerId;
    const sellerInfo = {
      ...listing.seller,
      phone: isOwner ? listing.seller.phone : undefined, // Never expose full phone publicly
    };

    return NextResponse.json({
      listing: {
        ...listing,
        seller: sellerInfo,
        isFavorited: user ? listing.favorites.length > 0 : false,
        isOwner,
        favorites: undefined,
      },
    });
  } catch (error) {
    console.error("Error fetching listing details:", error);
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listing = await db.listing.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Check ownership or admin
    if (listing.sellerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: You cannot modify this listing" }, { status: 403 });
    }

    const body = await req.json();
    const updated = await db.listing.update({
      where: { id: listing.id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.status && { status: body.status }),
        ...(body.condition && { condition: body.condition }),
        ...(body.isNegotiable !== undefined && { isNegotiable: body.isNegotiable }),
      },
    });

    return NextResponse.json({ success: true, listing: updated });
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listing = await db.listing.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.sellerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.listing.delete({
      where: { id: listing.id },
    });

    return NextResponse.json({ success: true, message: "Listing deleted" });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
  }
}
