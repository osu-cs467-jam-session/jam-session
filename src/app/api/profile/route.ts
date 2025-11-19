import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import ProfileModel from "@/app/models/profile";
import { connectToDatabase } from "@/app/lib/database";

// GET: return current user's profile
export async function GET() {
  try {
    const session = await auth();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const profile = await ProfileModel.findOne({
      clerkUserId: session.userId,
    }).lean();

    return NextResponse.json(profile || null, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
