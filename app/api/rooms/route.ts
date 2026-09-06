import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureDatabaseSeeded } from "@/lib/seedHelper";

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseSeeded(db);
    const { searchParams } = new URL(req.url);
    const locationSlug = searchParams.get("location");
    const roomType = searchParams.get("roomType");
    const furnishing = searchParams.get("furnishing");
    const gender = searchParams.get("gender");
    const maxRent = searchParams.get("maxRent") ? parseInt(searchParams.get("maxRent")!) : undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { status: "ACTIVE" };

    if (locationSlug && locationSlug !== "all") {
      where.location = { slug: locationSlug };
    }

    if (roomType && roomType !== "all") {
      where.roomType = roomType.toUpperCase();
    }

    if (furnishing && furnishing !== "all") {
      where.furnishing = furnishing.toUpperCase();
    }

    if (gender && gender !== "all") {
      where.genderPreference = gender.toUpperCase();
    }

    if (maxRent !== undefined) {
      where.rent = { lte: maxRent };
    }

    const rooms = await db.roomListing.findMany({
      where,
      include: {
        location: true,
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            isVerified: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Also fetch flatmate profiles
    const flatmates = await db.flatmateProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            isVerified: true,
            coachingHub: true,
            optionalSubject: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        total: rooms.length,
        rooms,
        flatmates,
      },
      {
        headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" },
      }
    );
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to post a room" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      rent,
      deposit,
      maintenance,
      roomType,
      furnishing,
      genderPreference,
      availableFrom,
      locationId,
      addressApprox,
      nearbyInstitutes,
      distanceToCoaching,
      amenities,
      houseRules,
      images,
    } = body;

    if (!title || !description || !rent || !locationId) {
      return NextResponse.json({ error: "Title, description, rent, and location are required" }, { status: 400 });
    }

    const cleanSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const uniqueSlug = `${cleanSlug}-${Math.random().toString(36).substring(2, 7)}`;

    const room = await db.roomListing.create({
      data: {
        slug: uniqueSlug,
        ownerId: user.id,
        title,
        description,
        rent: parseInt(rent),
        deposit: deposit ? parseInt(deposit) : 0,
        maintenance: maintenance ? parseInt(maintenance) : 0,
        roomType: roomType || "SINGLE",
        furnishing: furnishing || "FURNISHED",
        genderPreference: genderPreference || "ANY",
        availableFrom: availableFrom || "Immediate",
        locationId,
        addressApprox: addressApprox || "Near Coaching Hub",
        nearbyInstitutes: nearbyInstitutes || "Vajiram & Vision IAS",
        distanceToCoaching: distanceToCoaching || "5 mins walk",
        amenities: Array.isArray(amenities) ? amenities.join(", ") : (amenities || "AC, WiFi, RO Water"),
        houseRules: houseRules || "Quiet study environment",
        images: JSON.stringify(images && images.length > 0 ? images : [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80"
        ]),
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, room }, { status: 201 });
  } catch (error) {
    console.error("Error creating room listing:", error);
    return NextResponse.json({ error: "Failed to create room listing" }, { status: 500 });
  }
}
