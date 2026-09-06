import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDatabaseSeeded } from "@/lib/seedHelper";

export async function GET() {
  try {
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

    return NextResponse.json({ locations });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}
