import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import { getUserByUsername } from "@/app/models/user";

/** GET: Fetch user profile by username */
export async function GET(
  req: Request,
  context: { params: { username: string } }
) {
  await connectToDatabase();

  try {
    // Extract username from dynamic route
    const { username } = context.params;

    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Exclude hashed password
    const { hashedPassword, ...safeUser } = user;

    return NextResponse.json({ success: true, data: safeUser });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
