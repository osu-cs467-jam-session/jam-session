import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import { getUserByUsername } from "@/app/models/user";

/** GET: Fetch user profile by username */
export async function GET(req: Request, { params }: { params: { username: string } }) {
  await connectToDatabase();

  try {
    const user = await getUserByUsername(params.username);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { hashedPassword, ...safeUser } = user; // hide password
    return NextResponse.json({ success: true, data: safeUser });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 });
  }
}
