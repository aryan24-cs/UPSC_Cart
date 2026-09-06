import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDatabaseSeeded } from "@/lib/seedHelper";

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseSeeded(db);
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (category && category !== "ALL") {
      where.category = category.toUpperCase();
    }

    const services = await db.service.findMany({
      where,
      orderBy: { rating: "desc" },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
