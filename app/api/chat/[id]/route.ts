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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversation = await db.conversation.findUnique({
      where: { id },
      include: {
        listing: {
          include: {
            images: { take: 1, orderBy: { sortOrder: "asc" } },
            location: true,
          },
        },
        buyer: {
          select: { id: true, name: true, avatar: true, isVerified: true, coachingHub: true },
        },
        seller: {
          select: { id: true, name: true, avatar: true, isVerified: true, coachingHub: true },
        },
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (conversation.buyerId !== user.id && conversation.sellerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Mark unread messages as read
    await db.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: user.id },
        isRead: false,
      },
      data: { isRead: true },
    });

    // Fetch active offers related to this conversation's listing and buyer
    const offers = await db.offer.findMany({
      where: {
        listingId: conversation.listingId,
        buyerId: conversation.buyerId,
      },
      orderBy: { createdAt: "desc" },
    });

    const isBuyer = conversation.buyerId === user.id;
    const otherUser = isBuyer ? conversation.seller : conversation.buyer;

    return NextResponse.json({
      conversation: {
        ...conversation,
        otherUser,
        isBuyer,
        offers,
      },
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
  }
}
