import { NextRequest, NextResponse } from "next/server";
import ProfileModel from "@/app/models/profile";
import { connectToDatabase } from "@/app/lib/database";

/**
 * GET /api/profile/[username]
 * Fetch a user profile by username
 * Returns:
 *   - 200 + profile data if found
 *   - 404 if profile not found
 *   - 500 on internal server error
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Find profile by username
    const profile = await ProfileModel.findOne({ username }).lean();

    // Profile not found
    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    // Return profile data
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error(`GET /api/profile/${username} error:`, error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile/[username]
 * Delete a user profile by username.
 * Returns:
 *   - 200 if deletion successful
 *   - 404 if profile not found
 *   - 500 on internal server error
 */
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  try {
    // Connect to MongoDB
    await connectToDatabase();

    const deletedProfile = await ProfileModel.findOneAndDelete({ username });

    // Profile not found
    if (!deletedProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Return success message
    return NextResponse.json(
      { message: "Profile deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/profile/${username} error:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
