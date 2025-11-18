import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import ProfileModel, { IProfile } from "@/app/models/profile";
import { connectToDatabase } from "@/app/lib/database";

// ---------------------------------------------------------
// POST Create the logged-in user's profile
// ---------------------------------------------------------
export async function POST(req: Request) {
  try {
    const session = await auth(); // <-- await here

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const data = await req.json();

    const profileData: IProfile = {
      clerkUserId: session.userId,
      username: data.username,
      instrumentsArray: data.instrumentsArray || [],
      preferredGenre: data.preferredGenre,
      location: data.location,
      contact: data.contact,
    };

    const created = await ProfileModel.create(profileData);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------
// GET Return all profiles
// ---------------------------------------------------------
export async function GET() {
  try {
    await connectToDatabase();
    const profiles = await ProfileModel.find().lean();

    return NextResponse.json(profiles, { status: 200 });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}
