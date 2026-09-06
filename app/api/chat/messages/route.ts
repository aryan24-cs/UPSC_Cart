import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, content, type = "TEXT" } = await req.json();
    if (!conversationId || !content?.trim()) {
      return NextResponse.json({ error: "Conversation ID and content required" }, { status: 400 });
    }

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: { listing: true },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (conversation.buyerId !== user.id && conversation.sellerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const message = await db.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content: content.trim(),
        type,
      },
    });

    await db.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // Notify the other user
    const recipientId = conversation.buyerId === user.id ? conversation.sellerId : conversation.buyerId;
    await db.notification.create({
      data: {
        userId: recipientId,
        type: "MESSAGE",
        title: `Message from ${user.name}`,
        message: content.length > 60 ? `${content.substring(0, 60)}...` : content,
        link: `/chat/${conversationId}`,
      },
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
