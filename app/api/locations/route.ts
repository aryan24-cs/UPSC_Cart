import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDatabaseSeeded } from "@/lib/seedHelper";

let cachedLocations: any = null;
let lastCacheTime = 0;

export async function GET() {
  try {
    const now = Date.now();
    if (cachedLocations && now - lastCacheTime < 60000) {
      return NextResponse.json(
        { locations: cachedLocations },
        { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
      );
    }

    await ensureDatabaseSeeded(db);
    const locations = await db.location.findMany({
      include: {
        _count: {
          select: {
            listings: true,
            roomListings: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    cachedLocations = locations;
    lastCacheTime = now;

    return NextResponse.json(
      { locations },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}
