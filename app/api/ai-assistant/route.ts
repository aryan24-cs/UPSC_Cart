import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const lower = prompt.toLowerCase();

    let suggestedTitle = "";
    let suggestedDescription = "";
    let suggestedCategorySlug = "books";
    let suggestedPrice = 500;
    let suggestedTags = "";

    if (lower.includes("polity") || lower.includes("laxmikanth")) {
      suggestedTitle = "Indian Polity by M. Laxmikanth (Latest Edition) - Like New";
      suggestedDescription =
        "Comprehensive standard reference book for Indian Polity (UPSC CSE Prelims & Mains). Clean, lightly marked in pencil, binding completely intact. Ideal for 2025/2026 civil services preparation in ORN / Mukherjee Nagar.";
      suggestedCategorySlug = "books";
      suggestedPrice = 420;
      suggestedTags = "laxmikanth,polity,upsc,gs2,reference book";
    } else if (lower.includes("vision") || lower.includes("test series") || lower.includes("mock")) {
      suggestedTitle = "Vision IAS GS Prelims Test Series (Complete Printed Set with Model Answers)";
      suggestedDescription =
        "Complete set of Vision IAS Prelims mock tests with detailed solutions booklets. Covers NCERT basics, Subject-wise advanced tests, Current Affairs, and Full-length simulators. Unmarked question papers.";
      suggestedCategorySlug = "notes";
      suggestedPrice = 1100;
      suggestedTags = "vision ias,test series,prelims,mock tests,answer key";
    } else if (lower.includes("table") || lower.includes("desk")) {
      suggestedTitle = "Sturdy Wooden Study Table with Integrated Bookshelf";
      suggestedDescription =
        "Ergonomically designed study desk tailored for long UPSC preparation stretches. Includes top bookshelf holding 25+ standard books, footrest, wire grommet, and smooth laminate finish. Self-pickup from coaching area.";
      suggestedCategorySlug = "furniture";
      suggestedPrice = 1800;
      suggestedTags = "study table,desk,furniture,bookshelf,aspirant essentials";
    } else if (lower.includes("chair")) {
      suggestedTitle = "Ergonomic High-Back Mesh Study Chair with Lumbar Support";
      suggestedDescription =
        "Comfortable breathable mesh office/study chair. Adjustable height, tilt lock, and dedicated lumbar cushion. Essential for 10+ hours continuous sitting without lower back strain.";
      suggestedCategorySlug = "furniture";
      suggestedPrice = 1900;
      suggestedTags = "chair,study chair,ergonomic,furniture";
    } else if (lower.includes("cooler") || lower.includes("fan")) {
      suggestedTitle = "High Performance Cooling Appliance for Study Room";
      suggestedDescription =
        "Personal room cooling unit in good working order. Low power consumption, powerful air throw, well-maintained. Perfect for student rooms in Delhi coaching hubs during summer.";
      suggestedCategorySlug = "appliances";
      suggestedPrice = 650;
      suggestedTags = "cooling,fan,cooler,appliances,delhi summer";
    } else {
      // General smart generator
      const words = prompt.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      suggestedTitle = `${words} - Good Condition for UPSC Aspirants`;
      suggestedDescription = `Pre-owned ${prompt.trim()} in good, usable condition. Suitable for students preparing for civil services exam in Old Rajinder Nagar, Mukherjee Nagar or nearby hubs. Price negotiable for serious aspirants.`;
      suggestedCategorySlug = "books";
      suggestedPrice = 450;
      suggestedTags = "upsc,aspirant,study material,orn";
    }

    return NextResponse.json({
      success: true,
      suggestion: {
        title: suggestedTitle,
        description: suggestedDescription,
        categorySlug: suggestedCategorySlug,
        estimatedPrice: suggestedPrice,
        tags: suggestedTags,
      },
    });
  } catch (error) {
    console.error("AI Assistant error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
