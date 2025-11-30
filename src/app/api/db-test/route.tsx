import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import Profile from "@/app/models/profile";

export async function GET() {
  try {
    await connectToDatabase();
    const profiles = await Profile.find().lean();
    return NextResponse.json({ count: profiles.length, profiles });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
