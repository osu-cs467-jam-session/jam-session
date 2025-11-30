import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import Profile from "@/app/models/profile";

// Type for profile data returned to frontend
export type SafeProfile = {
  clerkUserId: string;
  username?: string;
  preferredGenre?: string;
  location?: string;
  instrumentsArray?: string[];
  contact?: string;
};

/** GET all profiles, optionally filtered by username or genre */
export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";

    // If a search term exists, search both username and preferredGenre
    const query = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { preferredGenre: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Fetch matching profiles and only select safe fields
    const profiles = await Profile.find(query, {
      clerkUserId: 1,
      username: 1,
      preferredGenre: 1,
      location: 1,
      instrumentsArray: 1,
      contact: 1,
      _id: 0,
    }).lean<SafeProfile[]>();

    return NextResponse.json({ success: true, data: profiles });
  } catch (error) {
    console.error("GET /api/all_profiles error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}
