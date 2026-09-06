import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required. You don't have permission to view the admin dashboard." },
        { status: 403 }
      );
    }

    const [
      totalUsers,
      totalListings,
      activeListings,
      reservedListings,
      soldListings,
      totalRooms,
      totalMessages,
      totalReports,
      pendingReports,
      recentListings,
      recentReports,
      users,
    ] = await Promise.all([
      db.user.count(),
      db.listing.count(),
      db.listing.count({ where: { status: "ACTIVE" } }),
      db.listing.count({ where: { status: "RESERVED" } }),
      db.listing.count({ where: { status: "SOLD" } }),
      db.roomListing.count(),
      db.message.count(),
      db.report.count(),
      db.report.count({ where: { status: "PENDING" } }),
      db.listing.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { seller: true, category: true, location: true },
      }),
      db.report.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { reporter: true },
      }),
      db.user.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isVerified: true,
          isMobileVerified: true,
          coachingHub: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalListings,
        activeListings,
        reservedListings,
        soldListings,
        totalRooms,
        totalMessages,
        totalReports,
        pendingReports,
      },
      recentListings,
      recentReports,
      users,
      isAdmin: true,
    });
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    return NextResponse.json({ error: "Failed to fetch admin metrics" }, { status: 500 });
  }
}
