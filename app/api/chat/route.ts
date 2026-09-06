import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await db.conversation.findMany({
      where: {
        OR: [{ buyerId: user.id }, { sellerId: user.id }],
      },
      include: {
        listing: {
          include: {
            images: { take: 1, orderBy: { sortOrder: "asc" } },
            location: true,
          },
        },
        buyer: {
          select: { id: true, name: true, avatar: true, isVerified: true },
        },
        seller: {
          select: { id: true, name: true, avatar: true, isVerified: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    const formatted = conversations.map((conv) => {
      const isBuyer = conv.buyerId === user.id;
      const otherUser = isBuyer ? conv.seller : conv.buyer;
      const lastMsg = conv.messages[0];

      return {
        id: conv.id,
        listing: conv.listing,
        otherUser,
        lastMessage: lastMsg ? lastMsg.content : "Conversation started",
        lastMessageAt: conv.lastMessageAt,
        isBuyer,
      };
    });

    return NextResponse.json({ conversations: formatted });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId, initialMessage } = await req.json();
    if (!listingId) {
      return NextResponse.json({ error: "Listing ID required" }, { status: 400 });
    }

    const listing = await db.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.sellerId === user.id) {
      return NextResponse.json({ error: "You cannot message yourself" }, { status: 400 });
    }

    // Find existing or create
    let conversation = await db.conversation.findUnique({
      where: {
        listingId_buyerId: {
          listingId: listing.id,
          buyerId: user.id,
        },
      },
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          listingId: listing.id,
          buyerId: user.id,
          sellerId: listing.sellerId,
        },
      });

      // Send initial message if provided
      const content = initialMessage || "Hi, is this still available?";
      await db.message.create({
        data: {
          conversationId: conversation.id,
          senderId: user.id,
          content,
          type: "TEXT",
        },
      });

      // Notify seller
      await db.notification.create({
        data: {
          userId: listing.sellerId,
          type: "MESSAGE",
          title: `New message from ${user.name}`,
          message: `Regarding "${listing.title}": "${content}"`,
          link: `/chat/${conversation.id}`,
        },
      });
    }

    return NextResponse.json({ conversationId: conversation.id });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
