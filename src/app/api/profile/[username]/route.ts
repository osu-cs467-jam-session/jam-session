// src/app/api/profile/[username]/route.ts
import { NextResponse } from "next/server";
import { getUserByUsername } from "@/app/lib/database";

// Define the GET handler with correct types for Next.js 15
export async function GET(
  _req: Request,
  context: { params: Promise<{ username: string }> } // params is now a Promise
) {
  // Await the params to get the username
  const { username } = await context.params;

  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Return the user object
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
