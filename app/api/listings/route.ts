import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureDatabaseSeeded } from "@/lib/seedHelper";

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseSeeded(db);
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim() || "";
    const categorySlug = searchParams.get("category") || "";
    const subcategory = searchParams.get("subcategory") || "";
    const locationSlug = searchParams.get("location") || "";
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const condition = searchParams.get("condition") || "";
    const sort = searchParams.get("sort") || "newest";
    const sellerId = searchParams.get("sellerId") || undefined;
    const statusParam = searchParams.get("status") || "ACTIVE";

    // Build filter conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (statusParam !== "ALL") {
      where.status = statusParam;
    }

    if (sellerId) {
      where.sellerId = sellerId;
    }

    if (categorySlug && categorySlug !== "all") {
      where.category = { slug: categorySlug };
    }

    if (subcategory && subcategory !== "all") {
      where.subcategory = subcategory;
    }

    if (locationSlug && locationSlug !== "all") {
      where.location = { slug: locationSlug };
    }

    if (condition && condition !== "all") {
      where.condition = condition.toUpperCase();
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
        { brand: { contains: search } },
        { subcategory: { contains: search } },
      ];
    }

    // Build sorting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    else if (sort === "price_desc") orderBy = { price: "desc" };
    else if (sort === "views") orderBy = { views: "desc" };

    const listings = await db.listing.findMany({
      where,
      orderBy,
      include: {
        category: true,
        location: true,
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            isVerified: true,
            responseRate: true,
            responseTime: true,
            createdAt: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
        favorites: user ? { where: { userId: user.id } } : false,
      },
    });

    const formattedListings = listings.map((l) => ({
      ...l,
      isFavorited: user ? l.favorites.length > 0 : false,
      favorites: undefined,
    }));

    const headers: Record<string, string> = user
      ? { "Cache-Control": "private, no-cache" }
      : { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" };

    return NextResponse.json(
      {
        total: listings.length,
        listings: formattedListings,
      },
      { headers }
    );
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to post a listing" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      price,
      originalPrice,
      isNegotiable,
      condition,
      categoryId,
      subcategory,
      locationId,
      images,
      brand,
      edition,
      purchaseYear,
      reasonForSelling,
      tags,
    } = body;

    if (!title || !description || price === undefined || !categoryId || !locationId) {
      return NextResponse.json(
        { error: "Please fill in all required fields (title, description, price, category, location)" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const cleanSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const uniqueSlug = `${cleanSlug}-${Math.random().toString(36).substring(2, 7)}`;

    const listing = await db.listing.create({
      data: {
        slug: uniqueSlug,
        title,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        isNegotiable: isNegotiable ?? true,
        condition: condition || "GOOD",
        status: "ACTIVE",
        sellerId: user.id,
        categoryId,
        subcategory: subcategory || null,
        locationId,
        brand: brand || null,
        edition: edition || null,
        purchaseYear: purchaseYear || null,
        reasonForSelling: reasonForSelling || null,
        tags: tags || null,
        images: {
          create: (images && images.length > 0
            ? images
            : ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"]
          ).map((url: string, index: number) => ({
            url,
            isCover: index === 0,
            sortOrder: index,
          })),
        },
      },
      include: {
        images: true,
        category: true,
        location: true,
        seller: true,
      },
    });

    // Notify user of successful publish
    await db.notification.create({
      data: {
        userId: user.id,
        type: "SYSTEM",
        title: "Listing Published Successfully!",
        message: `Your item "${listing.title}" is now live on UPSC Cart.`,
        link: `/listing/${listing.slug}`,
      },
    });

    return NextResponse.json({ success: true, listing }, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
