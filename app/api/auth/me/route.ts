import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({
      user: null,
      unreadNotifications: 0,
      unreadMessages: 0,
      favoritesCount: 0,
    });
  }

  const [unreadNotifications, unreadMessages, favoritesCount] = await Promise.all([
    db.notification
      .count({
        where: { userId: user.id, isRead: false },
      })
      .catch(() => 0),
    db.message
      .count({
        where: {
          conversation: {
            OR: [{ buyerId: user.id }, { sellerId: user.id }],
          },
          senderId: { not: user.id },
          isRead: false,
        },
      })
      .catch(() => 0),
    db.favorite
      .count({
        where: { userId: user.id },
      })
      .catch(() => 0),
  ]);

  // Strip sensitive fields
  const { password, ...safeUser } = user;

  return NextResponse.json({
    user: safeUser,
    unreadNotifications,
    unreadMessages,
    favoritesCount,
  });
}
