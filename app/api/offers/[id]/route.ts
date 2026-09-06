import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

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

    const offer = await db.offer.findUnique({
      where: { id },
      include: {
        listing: true,
        buyer: true,
        seller: true,
      },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // Only seller or buyer can modify offer
    if (offer.sellerId !== user.id && offer.buyerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { status, counterAmount } = await req.json();

    if (!["ACCEPTED", "REJECTED", "COUNTERED"].includes(status)) {
      return NextResponse.json({ error: "Invalid offer status" }, { status: 400 });
    }

    // Update the offer
    const updatedOffer = await db.offer.update({
      where: { id: offer.id },
      data: {
        status,
        ...(counterAmount ? { counterAmount: parseFloat(counterAmount) } : {}),
      },
    });

    // Find the conversation
    const conversation = await db.conversation.findFirst({
      where: {
        listingId: offer.listingId,
        buyerId: offer.buyerId,
      },
    });

    if (status === "ACCEPTED") {
      // 1. Mark listing as RESERVED!
      await db.listing.update({
        where: { id: offer.listingId },
        data: { status: "RESERVED" },
      });

      // 2. Notify buyer
      await db.notification.create({
        data: {
          userId: offer.buyerId,
          type: "OFFER_ACCEPTED",
          title: "Offer Accepted! 🎉",
          message: `${offer.seller.name} accepted your offer of ₹${offer.amount} for "${offer.listing.title}". Arrange a safe meetup to complete the deal!`,
          link: conversation ? `/chat/${conversation.id}` : `/listing/${offer.listing.slug}`,
        },
      });

      // 3. Post system message in conversation
      if (conversation) {
        await db.message.create({
          data: {
            conversationId: conversation.id,
            senderId: user.id,
            content: `🤝 Offer of ₹${offer.amount} ACCEPTED! Listing is now RESERVED. Coordinate meetup time & location.`,
            type: "OFFER_UPDATE",
            offerId: offer.id,
          },
        });
      }
    } else if (status === "REJECTED") {
      await db.notification.create({
        data: {
          userId: offer.buyerId,
          type: "OFFER_REJECTED",
          title: "Offer Declined",
          message: `${offer.seller.name} declined the offer of ₹${offer.amount} for "${offer.listing.title}".`,
          link: conversation ? `/chat/${conversation.id}` : `/listing/${offer.listing.slug}`,
        },
      });

      if (conversation) {
        await db.message.create({
          data: {
            conversationId: conversation.id,
            senderId: user.id,
            content: `❌ Offer of ₹${offer.amount} was declined.`,
            type: "OFFER_UPDATE",
            offerId: offer.id,
          },
        });
      }
    } else if (status === "COUNTERED") {
      await db.notification.create({
        data: {
          userId: offer.buyerId,
          type: "OFFER",
          title: "Counter Offer Received",
          message: `${offer.seller.name} countered with ₹${counterAmount} for "${offer.listing.title}".`,
          link: conversation ? `/chat/${conversation.id}` : `/listing/${offer.listing.slug}`,
        },
      });

      if (conversation) {
        await db.message.create({
          data: {
            conversationId: conversation.id,
            senderId: user.id,
            content: `🔄 Counter offer made: ₹${counterAmount}`,
            type: "OFFER_UPDATE",
            offerId: offer.id,
          },
        });
      }
    }

    return NextResponse.json({ success: true, offer: updatedOffer });
  } catch (error) {
    console.error("Error updating offer:", error);
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}
