import { NextResponse } from "next/server";
import { getUserByUsername } from "@/app/lib/database";

// API route to fetch user by their username
export async function GET(
  _req: Request,
  context: { params: { username: string } } // dynamic route parameters
) {
  // extract username from route parameters
  const { username } = await context.params;

  // retrieve user from database
  const user = await getUserByUsername(username);

  // if user is not found, return 404 response with error message
  if (!user) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  }

  // return user data as JSON
  return NextResponse.json(user);
}
