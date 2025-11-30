import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Profile from "@/app/models/profile";
import { connectToDatabase } from "@/app/lib/database";

/*
 * GET /api/profile
 * Fetch the profile of the currently authenticated user.
 * Returns:
 *   - 200 + profile data if found
 *   - 200 + null if profile does not exist
 *   - 401 if user is not authenticated
 *   - 500 on server error
 */
export async function GET() {
  try {
    // Get current user session
    const session = await auth();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Connect to MongoDB
    await connectToDatabase();

    // Find profile associated with the logged-in user
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

/*
 * PATCH /api/profile
 * Update the profile of the currently authenticated user.
 * Returns:
 *   - 200 + updated profile on success
 *   - 401 if user is not authenticated
 *   - 404 if profile does not exist
 *   - 500 on server error
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    await connectToDatabase();

    // Update profile and enforce schema validation
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

/*
 * POST /api/profile
 * Create a new profile for the currently authenticated user.
 * Returns:
 *   - 201 + profile data on success
 *   - 400 if profile already exists
 *   - 401 if user is not authenticated
 *   - 500 on server error
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    await connectToDatabase();

    // Check if profile already exists for the user
    const existing = await Profile.findOne({
      clerkUserId: session.userId,
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Profile already exists" },
        { status: 400 }
      );
    }

    // Create new profile
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
