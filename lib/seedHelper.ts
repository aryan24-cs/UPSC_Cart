import { PrismaClient } from "@prisma/client";

let isSeeding = false;
let databaseVerifiedSeeded = false;

function seedHash(password: string): string {
  const salt = "upsc_salt_secure";
  const crypto = require("crypto");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export async function ensureDatabaseSeeded(prisma: PrismaClient) {
  if (process.env.NODE_ENV === "production" || databaseVerifiedSeeded || isSeeding) {
    return;
  }

  try {
    const [roomCount, listingCount, serviceCount] = await Promise.all([
      prisma.roomListing.count().catch(() => 0),
      prisma.listing.count().catch(() => 0),
      prisma.service.count().catch(() => 0),
    ]);

    if (roomCount > 0 && listingCount > 0 && serviceCount > 0) {
      databaseVerifiedSeeded = true;
      return; // Database is fully populated
    }

    isSeeding = true;
    console.log("Auto-seeding UPSC Cart demo records into runtime database...");

    // 1. Locations (upsert)
    const locORN = await prisma.location.upsert({
      where: { slug: "old-rajinder-nagar" },
      update: {},
      create: {
        id: "loc_orn",
        name: "Old Rajinder Nagar",
        slug: "old-rajinder-nagar",
        city: "Delhi",
        state: "Delhi",
        area: "Central Delhi",
        latitude: 28.6389,
        longitude: 77.1812,
        radiusKm: 3.0,
      },
    });

    const locMN = await prisma.location.upsert({
      where: { slug: "mukherjee-nagar" },
      update: {},
      create: {
        id: "loc_mn",
        name: "Mukherjee Nagar",
        slug: "mukherjee-nagar",
        city: "Delhi",
        state: "Delhi",
        area: "North Delhi",
        latitude: 28.7088,
        longitude: 77.2144,
        radiusKm: 3.5,
      },
    });

    const locKB = await prisma.location.upsert({
      where: { slug: "karol-bagh" },
      update: {},
      create: {
        id: "loc_kb",
        name: "Karol Bagh",
        slug: "karol-bagh",
        city: "Delhi",
        state: "Delhi",
        area: "Central Delhi",
        latitude: 28.6517,
        longitude: 77.1906,
        radiusKm: 4.0,
      },
    });

    const locPN = await prisma.location.upsert({
      where: { slug: "patel-nagar" },
      update: {},
      create: {
        id: "loc_pn",
        name: "Patel Nagar",
        slug: "patel-nagar",
        city: "Delhi",
        state: "Delhi",
        area: "West Delhi",
        latitude: 28.6534,
        longitude: 77.1648,
        radiusKm: 4.0,
      },
    });

    const locLN = await prisma.location.upsert({
      where: { slug: "laxmi-nagar" },
      update: {},
      create: {
        id: "loc_ln",
        name: "Laxmi Nagar",
        slug: "laxmi-nagar",
        city: "Delhi",
        state: "Delhi",
        area: "East Delhi",
        latitude: 28.6304,
        longitude: 77.2773,
        radiusKm: 5.0,
      },
    });

    // 2. Categories
    const catBooks = await prisma.category.upsert({
      where: { slug: "books" },
      update: {},
      create: {
        id: "cat_books",
        name: "Books",
        slug: "books",
        icon: "BookOpen",
        description: "Standard reference books, NCERTs & optionals",
        sortOrder: 1,
      },
    });

    const catNotes = await prisma.category.upsert({
      where: { slug: "notes" },
      update: {},
      create: {
        id: "cat_notes",
        name: "Notes",
        slug: "notes",
        icon: "FileText",
        description: "Vision IAS, Vajiram, NEXT IAS handouts and topper notes",
        sortOrder: 2,
      },
    });

    await prisma.category.upsert({
      where: { slug: "test-series" },
      update: {},
      create: {
        id: "cat_test",
        name: "Test Series",
        slug: "test-series",
        icon: "Award",
        description: "Prelims & Mains test booklets with model answers",
        sortOrder: 3,
      },
    });

    const catFurniture = await prisma.category.upsert({
      where: { slug: "furniture" },
      update: {},
      create: {
        id: "cat_furniture",
        name: "Furniture",
        slug: "furniture",
        icon: "Armchair",
        description: "Study tables, ergonomic chairs, book racks",
        sortOrder: 4,
      },
    });

    const catAppliances = await prisma.category.upsert({
      where: { slug: "appliances" },
      update: {},
      create: {
        id: "cat_appliances",
        name: "Appliances",
        slug: "appliances",
        icon: "Fan",
        description: "Coolers, table fans, kettles, room heaters",
        sortOrder: 5,
      },
    });

    await prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        id: "cat_electronics",
        name: "Electronics",
        slug: "electronics",
        icon: "Laptop",
        description: "Tablets, study monitors, noise cancelling headphones, desk lamps",
        sortOrder: 6,
      },
    });

    await prisma.category.upsert({
      where: { slug: "stationery" },
      update: {},
      create: {
        id: "cat_stationery",
        name: "Stationery",
        slug: "stationery",
        icon: "PenTool",
        description: "UPSC standard answer sheets, highlighters, maps, sticky notes",
        sortOrder: 7,
      },
    });

    await prisma.category.upsert({
      where: { slug: "room-essentials" },
      update: {},
      create: {
        id: "cat_room_essentials",
        name: "Room Essentials",
        slug: "room-essentials",
        icon: "Home",
        description: "Mattresses, curtains, storage organizers, laundry bags",
        sortOrder: 8,
      },
    });

    // 3. Users
    const userAryan = await prisma.user.upsert({
      where: { email: "aryan.nda.2163@gmail.com" },
      update: {},
      create: {
        id: "user_aryan",
        name: "Aryan Kumar",
        email: "aryan.nda.2163@gmail.com",
        password: seedHash("password123"),
        phone: "+91 98765 43210",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        role: "USER",
        isVerified: true,
        isMobileVerified: true,
        bio: "UPSC Aspirant | Target 2026 | PSIR Optional. Based in Old Rajinder Nagar near Bada Bazar.",
        coachingHub: "Old Rajinder Nagar",
        optionalSubject: "PSIR",
        targetYear: 2026,
        responseRate: "98%",
        responseTime: "< 15 mins",
      },
    });

    await prisma.user.upsert({
      where: { email: "demo.user@upsc-cart.local" },
      update: {},
      create: {
        id: "demo-user-aspirant",
        name: "Aryan Kumar (Demo)",
        email: "demo.user@upsc-cart.local",
        password: seedHash("demo123"),
        phone: "+91 98765 43210",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        role: "USER",
        isVerified: true,
        isMobileVerified: true,
        bio: "Demo Aspirant Account for platform evaluation. Target CSE 2026.",
        coachingHub: "Old Rajinder Nagar",
        optionalSubject: "PSIR",
        targetYear: 2026,
        responseRate: "99%",
        responseTime: "< 10 mins",
      },
    });

    const userPriya = await prisma.user.upsert({
      where: { email: "priya.aspirant@gmail.com" },
      update: {},
      create: {
        id: "user_priya",
        name: "Priya Sharma",
        email: "priya.aspirant@gmail.com",
        password: seedHash("password123"),
        phone: "+91 98123 45678",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
        role: "USER",
        isVerified: true,
        isMobileVerified: true,
        bio: "UPSC Mains 2024 appeared. Downsizing standard reference materials and notes before moving.",
        coachingHub: "Old Rajinder Nagar",
        optionalSubject: "Sociology",
        targetYear: 2025,
        responseRate: "95%",
        responseTime: "< 10 mins",
      },
    });

    const userVikram = await prisma.user.upsert({
      where: { email: "vikram.orn@gmail.com" },
      update: {},
      create: {
        id: "user_vikram",
        name: "Vikram Aditya",
        email: "vikram.orn@gmail.com",
        password: seedHash("password123"),
        phone: "+91 97234 56789",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        role: "USER",
        isVerified: true,
        isMobileVerified: true,
        bio: "Mukherjee Nagar aspirant. Shifting flat, selling furniture and room appliances.",
        coachingHub: "Mukherjee Nagar",
        optionalSubject: "History",
        targetYear: 2026,
        responseRate: "100%",
        responseTime: "< 5 mins",
      },
    });

    await prisma.user.upsert({
      where: { email: "demo.admin@upsc-cart.local" },
      update: {},
      create: {
        id: "demo-admin-user",
        name: "Vikas Sharma (Admin)",
        email: "demo.admin@upsc-cart.local",
        password: seedHash("admin123"),
        phone: "+91 99999 00002",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
        role: "ADMIN",
        isVerified: true,
        isMobileVerified: true,
        bio: "Demo Administrator Account for evaluating moderation, reports, and listings.",
        coachingHub: "Delhi NCR",
        responseRate: "100%",
        responseTime: "< 1 min",
      },
    });

    // 4. Listings (upsert)
    const lFan = await prisma.listing.upsert({
      where: { slug: "high-speed-table-fan-old-rajinder-nagar" },
      update: {},
      create: {
        id: "list_fan",
        slug: "high-speed-table-fan-old-rajinder-nagar",
        title: "High Speed Table Fan",
        description: "High speed portable table fan with 3-speed regulator and wide-angle oscillation. High air thrust with low power consumption. Perfect for study desk setups during long preparation sessions in Old Rajinder Nagar. Purchased last season, working in 100% prime condition.",
        price: 300,
        originalPrice: 750,
        isNegotiable: true,
        condition: "GOOD",
        status: "ACTIVE",
        sellerId: userVikram.id,
        categoryId: catAppliances.id,
        subcategory: "Table Fans",
        locationId: locORN.id,
        distanceStr: "2 km away",
        views: 142,
        brand: "Bajaj / Usha",
        reasonForSelling: "Shifting to an AC room next week.",
        tags: "fan,table fan,cooling,appliances,study desk",
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1618941716939-553df3c6c278?w=800&auto=format&fit=crop&q=80",
              isCover: true,
              sortOrder: 0,
            },
          ],
        },
      },
    });

    await prisma.listing.upsert({
      where: { slug: "reliable-cooler-for-summer-mukherjee-nagar" },
      update: {},
      create: {
        id: "list_cooler",
        slug: "reliable-cooler-for-summer-mukherjee-nagar",
        title: "Reliable Cooler for Summer",
        description: "Symphony 35L personal desert cooler with heavy-duty motor, honeycomb cooling pads, and castor wheels. Powerful air throw up to 25 ft. Clean water tank, used for just 4 months. Essential for Delhi summers in coaching areas. Self pickup from Batra Cinema lane, Mukherjee Nagar.",
        price: 2000,
        originalPrice: 4800,
        isNegotiable: true,
        condition: "GOOD",
        status: "ACTIVE",
        sellerId: userVikram.id,
        categoryId: catAppliances.id,
        subcategory: "Room Coolers",
        locationId: locMN.id,
        distanceStr: "1.2 km away",
        views: 289,
        brand: "Symphony",
        reasonForSelling: "Completed Mains exam, moving back home.",
        tags: "cooler,air cooler,summer,appliances,mukherjee nagar",
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80",
              isCover: true,
              sortOrder: 0,
            },
          ],
        },
      },
    });

    const lPolity = await prisma.listing.upsert({
      where: { slug: "indian-polity-m-laxmikanth-7th-edition-orn" },
      update: {},
      create: {
        id: "list_polity",
        slug: "indian-polity-m-laxmikanth-7th-edition-orn",
        title: "Indian Polity by M. Laxmikanth (7th Edition)",
        description: "Latest 7th Edition of the UPSC 'Bible' for Indian Polity by McGraw Hill. Covers all constitutional amendments, GST council updates, and recent Supreme Court judgments. Very lightly highlighted in pencil on first 4 chapters only; rest 100% clean and undamaged spine.",
        price: 420,
        originalPrice: 895,
        isNegotiable: true,
        condition: "LIKE_NEW",
        status: "ACTIVE",
        sellerId: userPriya.id,
        categoryId: catBooks.id,
        subcategory: "Polity",
        locationId: locORN.id,
        distanceStr: "500m away",
        views: 312,
        brand: "McGraw Hill",
        edition: "7th Edition (Latest)",
        purchaseYear: "2024",
        reasonForSelling: "Upgraded to digital tablet notes.",
        tags: "laxmikanth,polity,upsc books,mcgraw hill,gs2",
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
              isCover: true,
              sortOrder: 0,
            },
          ],
        },
      },
    });

    const lVision = await prisma.listing.upsert({
      where: { slug: "vision-ias-gs-prelims-test-series-2025-orn" },
      update: {},
      create: {
        id: "list_vision",
        slug: "vision-ias-gs-prelims-test-series-2025-orn",
        title: "Vision IAS GS Prelims 2025 Test Series (35 Tests + Model Solutions)",
        description: "Full printed set of Vision IAS 2025 All India Prelims Test Series papers (Tests 1 to 35). Includes sectional NCERT revision tests, advanced tests, CA tests, and Full Mock Tests with exhaustive solution booklets. Clean, unmarked question papers ready for practice.",
        price: 1200,
        originalPrice: 15500,
        isNegotiable: true,
        condition: "LIKE_NEW",
        status: "ACTIVE",
        sellerId: userPriya.id,
        categoryId: catNotes.id,
        subcategory: "Vision IAS",
        locationId: locORN.id,
        distanceStr: "300m away",
        views: 450,
        brand: "Vision IAS",
        edition: "2025 Test Series",
        reasonForSelling: "Completed full syllabus revision.",
        tags: "vision ias,test series,prelims,mock test,answer keys",
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
              isCover: true,
              sortOrder: 0,
            },
          ],
        },
      },
    });

    await prisma.listing.upsert({
      where: { slug: "sturdy-wooden-study-table-with-bookshelf-orn" },
      update: {},
      create: {
        id: "list_table",
        slug: "sturdy-wooden-study-table-with-bookshelf-orn",
        title: "Solid Sheesham Finish Study Table with Integrated Bookshelf",
        description: "Custom carpentry study desk designed specifically for UPSC aspirants. Heavy-duty engineered wood with 2 top shelves holding up to 35 standard books, side pen holders, laptop compartment, and comfortable footrest. Dimensions: 42 inch wide x 24 inch depth x 30 inch height.",
        price: 1800,
        originalPrice: 4200,
        isNegotiable: true,
        condition: "GOOD",
        status: "ACTIVE",
        sellerId: userPriya.id,
        categoryId: catFurniture.id,
        subcategory: "Study Tables",
        locationId: locORN.id,
        distanceStr: "800m away",
        views: 185,
        brand: "Custom ORN Carpenter",
        reasonForSelling: "Shifting to furnished flat.",
        tags: "study table,desk,furniture,bookshelf,orn",
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80",
              isCover: true,
              sortOrder: 0,
            },
          ],
        },
      },
    });

    await prisma.listing.upsert({
      where: { slug: "spectrum-brief-history-of-modern-india-rajiv-ahir" },
      update: {},
      create: {
        id: "list_spectrum",
        slug: "spectrum-brief-history-of-modern-india-rajiv-ahir",
        title: "Spectrum: A Brief History of Modern India (Rajiv Ahir)",
        description: "The definitive reference text for Modern Indian History Prelims & Mains. Pristine condition with chronological summary charts intact. No markings or folded pages.",
        price: 210,
        originalPrice: 450,
        isNegotiable: false,
        condition: "NEW",
        status: "ACTIVE",
        sellerId: userPriya.id,
        categoryId: catBooks.id,
        subcategory: "History & Culture",
        locationId: locKB.id,
        distanceStr: "1.5 km away",
        views: 220,
        brand: "Spectrum Books",
        edition: "2024 Revised Edition",
        tags: "spectrum,modern history,rajiv ahir,upsc,gs1",
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
              isCover: true,
              sortOrder: 0,
            },
          ],
        },
      },
    });

    await prisma.listing.upsert({
      where: { slug: "vajiram-ravi-psir-optional-complete-handouts" },
      update: {},
      create: {
        id: "list_psir",
        slug: "vajiram-ravi-psir-optional-complete-handouts",
        title: "Vajiram & Ravi PSIR Optional Complete Handouts (Paper 1 & Paper 2)",
        description: "Complete postal coaching handouts for Political Science and International Relations (PSIR Optional) from Vajiram & Ravi. Includes Western Political Thought, Indian Political Thought, Comparative Politics, and IR Theories with recent case studies.",
        price: 1600,
        originalPrice: 9500,
        isNegotiable: true,
        condition: "GOOD",
        status: "ACTIVE",
        sellerId: userPriya.id,
        categoryId: catNotes.id,
        subcategory: "Vajiram & Ravi",
        locationId: locORN.id,
        distanceStr: "400m away",
        views: 390,
        brand: "Vajiram & Ravi",
        tags: "psir,optional,vajiram,political science,international relations",
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
              isCover: true,
              sortOrder: 0,
            },
          ],
        },
      },
    });

    await prisma.listing.upsert({
      where: { slug: "ergonomic-high-back-mesh-study-chair-patel-nagar" },
      update: {},
      create: {
        id: "list_chair",
        slug: "ergonomic-high-back-mesh-study-chair-patel-nagar",
        title: "Ergonomic High Back Mesh Study Chair with Lumbar Support",
        description: "High-grade breathable mesh chair with adjustable lumbar support, 3D armrests, and smooth hydraulic lift. Prevents back pain during 10+ hour continuous study stretches. Wheels and gas lift in excellent shape.",
        price: 1900,
        originalPrice: 5200,
        isNegotiable: true,
        condition: "GOOD",
        status: "ACTIVE",
        sellerId: userVikram.id,
        categoryId: catFurniture.id,
        subcategory: "Ergonomic Chairs",
        locationId: locPN.id,
        distanceStr: "2.5 km away",
        views: 175,
        brand: "Green Soul / Savya Home",
        tags: "chair,study chair,ergonomic,furniture,patel nagar",
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
              isCover: true,
              sortOrder: 0,
            },
          ],
        },
      },
    });

    // 5. Room Listings (upsert)
    await prisma.roomListing.upsert({
      where: { slug: "single-room-with-balcony-near-orn-bada-bazar" },
      update: {},
      create: {
        id: "room_single_orn",
        slug: "single-room-with-balcony-near-orn-bada-bazar",
        ownerId: userVikram.id,
        title: "Single Private Room with Balcony near ORN Bada Bazar",
        description: "Sunlit, peaceful top-floor single room with an independent balcony and attached washroom in the prime coaching hub of Old Rajinder Nagar. Strictly for serious civil services aspirants. High speed fiber internet included.",
        rent: 11500,
        deposit: 11500,
        maintenance: 500,
        roomType: "SINGLE",
        furnishing: "FURNISHED",
        genderPreference: "ANY",
        availableFrom: "Immediate",
        locationId: locORN.id,
        addressApprox: "Lane 7, near Bada Bazar Circle, Old Rajinder Nagar",
        nearbyInstitutes: "2 mins walk to Vajiram & Ravi, 4 mins to Vision IAS, 3 mins to Metro",
        distanceToCoaching: "2 mins walk",
        amenities: "AC, High Speed WiFi (300Mbps), Geyser, RO Drinking Water, Study Table & Chair, Almirah, Power Backup",
        houseRules: "No loud music, peaceful study environment, non-interfering owner.",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
        ]),
        status: "ACTIVE",
      },
    });

    await prisma.roomListing.upsert({
      where: { slug: "double-sharing-ac-pg-near-batra-cinema-mukherjee-nagar" },
      update: {},
      create: {
        id: "room_pg_mn",
        slug: "double-sharing-ac-pg-near-batra-cinema-mukherjee-nagar",
        ownerId: userVikram.id,
        title: "Double Sharing AC PG Room with Home-Style Meals",
        description: "Spacious twin-sharing air-conditioned room in a student-friendly PG directly opposite Batra Cinema. Includes 3 hygienic, home-cooked vegetarian meals every day, daily room cleaning, and study hall access.",
        rent: 7500,
        deposit: 5000,
        maintenance: 0,
        roomType: "PG",
        furnishing: "FURNISHED",
        genderPreference: "MALE",
        availableFrom: "From 15th of this month",
        locationId: locMN.id,
        addressApprox: "Commercial Complex road, near Batra Cinema, Mukherjee Nagar",
        nearbyInstitutes: "Drishti IAS (1 min), Dhyeya IAS (3 mins), Batra Metro (5 mins)",
        distanceToCoaching: "1 min walk",
        amenities: "AC, 3 Meals/Day (Pure Veg), WiFi, Daily Housekeeping, Geyser, Laundry Facility, RO Water",
        houseRules: "Gate closing time 11:30 PM, no smoking, quiet hours after 11 PM.",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80",
        ]),
        status: "ACTIVE",
      },
    });

    // 6. Flatmate Profile (upsert)
    const fpCount = await prisma.flatmateProfile.count().catch(() => 0);
    if (fpCount === 0) {
      await prisma.flatmateProfile.create({
        data: {
          userId: userAryan.id,
          title: "UPSC 2026 Aspirant seeking Flatmate for 2BHK in ORN",
          budget: 8500,
          preferredArea: "Old Rajinder Nagar / Karol Bagh",
          gender: "MALE",
          moveInDate: "Immediate",
          studySchedule: "Day Owl (6 AM - 11 PM), quiet study environment",
          foodPreference: "Pure Veg preferred / Cook sharing",
          smokingPreference: "Strictly Non-smoker",
          roomTypePreference: "Separate private room in shared 2BHK/3BHK",
          bio: "Preparing for CSE 2026 with PSIR optional. Looking for a serious, disciplined co-aspirant to share a peaceful 2BHK flat near Vajiram.",
        },
      });
    }

    // 7. Services (upsert)
    const svcCount = await prisma.service.count().catch(() => 0);
    if (svcCount === 0) {
      await prisma.service.create({
        data: {
          title: "Aggarwal Pure Veg Home Tiffin Service",
          category: "TIFFIN",
          providerName: "Ramesh Aggarwal",
          phone: "+91 98711 22334",
          locationId: locORN.id,
          locationName: "Old Rajinder Nagar & Karol Bagh",
          pricingStr: "₹3,200/month (Lunch + Dinner, 6 days/week)",
          rating: 4.9,
          reviewCount: 148,
          description: "Fresh, low-oil, nutritious home food tailored for aspirants. Includes 4 chapatis (ghee applied on request), dal, seasonal sabzi, rice, and fresh salad. Delivered hot to your room doorstep.",
          isVerified: true,
          badges: "FSSAI Registered,Hygiene Certified,Timely Delivery",
        },
      });

      await prisma.service.create({
        data: {
          title: "Shree Balaji Fast Notes Photocopy & Spiral Binding",
          category: "PRINTING",
          providerName: "Sunil Sharma",
          phone: "+91 98102 33445",
          locationId: locORN.id,
          locationName: "Bada Bazar, Old Rajinder Nagar",
          pricingStr: "₹0.60/page B&W, ₹25 Spiral Binding",
          rating: 4.8,
          reviewCount: 310,
          description: "Specialized in quick printing of monthly current affairs compilations, Vision IAS test answer booklets, and coaching handouts. WhatsApp your PDF and pick up ready copies within 15 mins.",
          isVerified: true,
          badges: "Fast Turnaround,Laser Quality,Bulk Discounts",
        },
      });

      await prisma.service.create({
        data: {
          title: "Sankalp 24/7 Silent AC Reading Room & Library",
          category: "LIBRARY",
          providerName: "Sankalp Study Center",
          phone: "+91 98991 44556",
          locationId: locMN.id,
          locationName: "Batra Cinema Lane, Mukherjee Nagar",
          pricingStr: "₹1,600/month (12hr shift) | ₹2,200/month (24hr access)",
          rating: 4.9,
          reviewCount: 220,
          description: "Soundproof, ergonomic study cabins with personal pinboards, LED lamps, power sockets, high-speed optic fiber WiFi, and clean washrooms. Strictly pin-drop silence maintained.",
          isVerified: true,
          badges: "Biometric Access,CCTV Monitored,Locker Facility",
        },
      });
    }

    // 8. Conversations & Offers
    const convCount = await prisma.conversation.count().catch(() => 0);
    if (convCount === 0) {
      const conv1 = await prisma.conversation.create({
        data: {
          id: "conv_aryan_fan",
          listingId: lFan.id,
          buyerId: userAryan.id,
          sellerId: userVikram.id,
          lastMessageAt: new Date(),
        },
      });

      await prisma.message.create({
        data: {
          conversationId: conv1.id,
          senderId: userAryan.id,
          content: "Hello! Is this High Speed Table Fan still available?",
          type: "TEXT",
          isRead: true,
        },
      });

      await prisma.message.create({
        data: {
          conversationId: conv1.id,
          senderId: userVikram.id,
          content: "Hi Aryan, yes it is! The motor is in top condition and speeds work smoothly.",
          type: "TEXT",
          isRead: true,
        },
      });

      const offer1 = await prisma.offer.create({
        data: {
          id: "offer_aryan_fan_250",
          listingId: lFan.id,
          buyerId: userAryan.id,
          sellerId: userVikram.id,
          amount: 250,
          status: "PENDING",
          message: "Would you accept ₹250? I can collect it from ORN Bada Bazar this evening.",
        },
      });

      await prisma.message.create({
        data: {
          conversationId: conv1.id,
          senderId: userAryan.id,
          content: "Made an offer for ₹250. Can collect from ORN Bada Bazar today.",
          type: "OFFER_UPDATE",
          offerId: offer1.id,
          isRead: true,
        },
      });
    }

    databaseVerifiedSeeded = true;
    console.log("UPSC Cart demo database successfully populated!");
  } catch (err) {
    console.error("Auto-seeding error:", err);
  } finally {
    isSeeding = false;
  }
}
