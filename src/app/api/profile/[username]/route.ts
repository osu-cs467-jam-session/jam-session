import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import ProfileModel from "@/app/models/profile";

// keep params as a Promise here to match this project's RouteHandlerConfig typing
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

    const safeProfile = JSON.parse(JSON.stringify(profile));
    return NextResponse.json({ success: true, data: safeProfile });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;
  const body = await req.json();

  try {
    await connectToDatabase();

    const updated = await ProfileModel.findOneAndUpdate({ username }, body, {
      new: true,
      lean: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    const safeUpdated = JSON.parse(JSON.stringify(updated));
    return NextResponse.json({ success: true, data: safeUpdated });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  try {
    await connectToDatabase();

    const deleted = await ProfileModel.findOneAndDelete({ username });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Profile deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
