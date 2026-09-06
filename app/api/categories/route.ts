import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDatabaseSeeded } from "@/lib/seedHelper";

export async function GET() {
  try {
    await ensureDatabaseSeeded(db);
    const categories = await db.category.findMany({
      include: {
        subcategories: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { listings: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
