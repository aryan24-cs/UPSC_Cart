import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword, phone, coachingHub } = await req.json();

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Full Name is required." }, { status: 400 });
    }

    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must contain at least 8 characters." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for existing user
    const existing = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // Security: Normal registration ALWAYS creates role "USER"
    const hashedPassword = hashPassword(password);

    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone?.trim() || null,
        coachingHub: coachingHub?.trim() || "Old Rajinder Nagar",
        role: "USER",
        isVerified: false,
        isMobileVerified: false,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      },
    });

    // Create session
    await createSession(user.id);

    const { password: _, ...safeUser } = user;
    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
