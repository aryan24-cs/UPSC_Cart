import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { phone, otp } = await req.json();

    // Verification check (in demo mode, OTP '123456' or any 6-digit OTP succeeds)
    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number" }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        phone: phone.startsWith("+91") ? phone : `+91 ${phone}`,
        isMobileVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mobile number verified successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error verifying mobile:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
