import { NextRequest, NextResponse } from "next/server";
import ProfileModel from "@/app/models/profile";
import { connectToDatabase } from "@/app/lib/database";

/**
 * GET
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  try {
    await connectToDatabase();

    const profile = await ProfileModel.findOne({ username }).lean();

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

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
 * DELETE
 */
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  try {
    await connectToDatabase();

    const deletedProfile = await ProfileModel.findOneAndDelete({ username });

    if (!deletedProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

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
