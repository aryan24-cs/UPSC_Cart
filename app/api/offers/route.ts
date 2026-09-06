import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to make an offer" }, { status: 401 });
    }

    const { listingId, amount, message } = await req.json();
    if (!listingId || !amount) {
      return NextResponse.json({ error: "Listing ID and offer amount are required" }, { status: 400 });
    }

    const listing = await db.listing.findUnique({
      where: { id: listingId },
      include: { seller: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.sellerId === user.id) {
      return NextResponse.json({ error: "You cannot make an offer on your own listing" }, { status: 400 });
    }

    if (listing.status !== "ACTIVE") {
      return NextResponse.json({ error: `Cannot make an offer on a listing that is ${listing.status.toLowerCase()}` }, { status: 400 });
    }

    // Create the offer
    const offer = await db.offer.create({
      data: {
        listingId: listing.id,
        buyerId: user.id,
        sellerId: listing.sellerId,
        amount: parseFloat(amount),
        status: "PENDING",
        message: message || `Offered ₹${amount}`,
      },
    });

    // Find or create conversation
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
    }

    // Add offer message to conversation
    await db.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        content: `Made an offer of ₹${amount}${message ? ` - "${message}"` : ""}`,
        type: "OFFER_UPDATE",
        offerId: offer.id,
      },
    });

    // Update lastMessageAt
    await db.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    // Notify seller
    await db.notification.create({
      data: {
        userId: listing.sellerId,
        type: "OFFER",
        title: "New Offer Received!",
        message: `${user.name} offered ₹${amount} for "${listing.title}".`,
        link: `/chat/${conversation.id}`,
      },
    });

    return NextResponse.json({ success: true, offer, conversationId: conversation.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating offer:", error);
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}
