import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import ProfileModel from "@/app/models/profile";

export async function GET(
  _req: Request,
  context: { params: { username: string } }
) {
  const { username } = context.params;

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
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
