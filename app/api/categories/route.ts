import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDatabaseSeeded } from "@/lib/seedHelper";

let cachedCategories: any = null;
let lastCacheTime = 0;

export async function GET() {
  try {
    const now = Date.now();
    if (cachedCategories && now - lastCacheTime < 60000) {
      return NextResponse.json({ categories: cachedCategories });
    }

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

    cachedCategories = categories;
    lastCacheTime = now;

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
