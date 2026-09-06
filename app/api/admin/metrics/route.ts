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
      totalFlatmates,
      totalServices,
      totalMessages,
      totalOffers,
      totalReports,
      pendingReports,
      activeListingsData,
      soldListingsData,
      categoriesWithCount,
      locationsWithCount,
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
      db.flatmateProfile.count(),
      db.service.count(),
      db.message.count(),
      db.offer.count(),
      db.report.count(),
      db.report.count({ where: { status: "PENDING" } }),
      db.listing.findMany({
        where: { status: "ACTIVE" },
        select: { price: true },
      }),
      db.listing.findMany({
        where: { status: "SOLD" },
        select: { price: true },
      }),
      db.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: { listings: true },
          },
        },
        orderBy: { sortOrder: "asc" },
      }),
      db.location.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: { listings: true, roomListings: true },
          },
        },
      }),
      db.listing.findMany({
        take: 12,
        orderBy: { createdAt: "desc" },
        include: { seller: true, category: true, location: true },
      }),
      db.report.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { reporter: true },
      }),
      db.user.findMany({
        take: 15,
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
          _count: {
            select: { listings: true },
          },
        },
      }),
    ]);

    // Financial & Inventory Aggregations
    const activeInventoryValue = activeListingsData.reduce((acc, curr) => acc + (curr.price || 0), 0);
    const completedSalesValue = soldListingsData.reduce((acc, curr) => acc + (curr.price || 0), 0);
    const avgActivePrice = activeListings > 0 ? Math.round(activeInventoryValue / activeListings) : 0;

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalListings,
        activeListings,
        reservedListings,
        soldListings,
        totalRooms,
        totalFlatmates,
        totalServices,
        totalMessages,
        totalOffers,
        totalReports,
        pendingReports,
        activeInventoryValue,
        completedSalesValue,
        avgActivePrice,
      },
      categoryBreakdown: categoriesWithCount.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c._count.listings,
      })),
      locationBreakdown: locationsWithCount.map((l) => ({
        id: l.id,
        name: l.name,
        slug: l.slug,
        listingsCount: l._count.listings,
        roomsCount: l._count.roomListings,
      })),
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
