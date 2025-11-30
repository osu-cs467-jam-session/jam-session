import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Profile from "@/app/models/profile";
import { connectToDatabase } from "@/app/lib/database";

// GET: return current user's profile
export async function GET() {
  try {
    const session = await auth();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const profile = await Profile.findOne({
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

// PATCH: update current user's profile
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    await connectToDatabase();

    const updatedProfile = await Profile.findOneAndUpdate(
      { clerkUserId: session.userId },
      { $set: data },
      { new: true, runValidators: true } // return updated doc & enforce schema
    ).lean();

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedProfile });
  } catch (error) {
    console.error("PATCH /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// POST: create new profile for current user
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    await connectToDatabase();

    // optionally check if profile already exists
    const existing = await Profile.findOne({
      clerkUserId: session.userId,
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Profile already exists" },
        { status: 400 }
      );
    }

    const profile = await Profile.create({
      ...data,
      clerkUserId: session.userId,
    });

    return NextResponse.json({ success: true, data: profile }, { status: 201 });
  } catch (error) {
    console.error("POST /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
