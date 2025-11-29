import { NextRequest, NextResponse } from "next/server";
import ProfileModel from "@/app/models/profile";
import { connectToDatabase } from "@/app/lib/database";

/**
 * GET /api/profile/[username]
 * Fetch profile by username from database
 *
 * @param _req - incoming HTTP request (unused here)
 * @param context -provides route parameters, here a Promise containing { username }
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ username: string }> }
) {
  // await params object to extract the username for dynamic route
  const { username } = await context.params;

  try {
    await connectToDatabase();

    // query database for profile matching the given username
    const profile = await ProfileModel.findOne({ username }).lean(); // `.lean()` returns plain JS objects

    // if no profile found, respond with 404 status and error message
    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    // return found profile in JSON format
    return NextResponse.json({ success: true, data: profile }, { status: 200 });
  } catch (error) {
    // log any errors for debugging
    console.error(`GET /api/profile/${username} error:`, error);

    // return generic 500 error response to client
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { username: string } }
) {
  await connectToDatabase();
  const { username } = await params;

  const deletedProfile = await ProfileModel.findOneAndDelete({ username });

  if (!deletedProfile) {
    return new Response(JSON.stringify({ error: "Profile not found" }), {
      status: 404,
    });
  }

  return new Response(
    JSON.stringify({ message: "Profile deleted successfully" }),
    { status: 200 }
  );
}
