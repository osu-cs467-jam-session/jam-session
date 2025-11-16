import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/app/lib/database";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  IUser,
} from "@/app/models/user";
import mongoose from "mongoose";

export type SafeUser = Omit<IUser, "hashedPassword">;

function excludeHashedPassword(user: IUser): SafeUser {
  const { hashedPassword, ...rest } = user;
  return rest;
}

/** GET: Fetch all users */
export async function GET() {
  await connectToDatabase();
  try {
    const users = await getUsers();
    const safeUsers = users.map(excludeHashedPassword);
    return NextResponse.json({ success: true, data: safeUsers });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/** POST: Create new user */
export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();
    const hashed = await bcrypt.hash(body.password, 10);
    const newUser = await createUser({ ...body, hashedPassword: hashed });
    const safeUser = excludeHashedPassword(newUser);
    return NextResponse.json(
      { success: true, data: safeUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}

/** PUT: Update existing user */
export async function PUT(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();
    if (!body._id || !mongoose.Types.ObjectId.isValid(body._id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing ID" },
        { status: 400 }
      );
    }
    const updatedUser = await updateUser(body._id, body);
    if (!updatedUser)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    const safeUser = excludeHashedPassword(updatedUser);
    return NextResponse.json({ success: true, data: safeUser });
  } catch (error) {
    console.error("PUT /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

/** DELETE: Remove user by id */
export async function DELETE(request: Request) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing ID" },
        { status: 400 }
      );
    }
    const deletedUser = await deleteUser(id);
    if (!deletedUser)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    const safeUser = excludeHashedPassword(deletedUser);
    return NextResponse.json({ success: true, data: safeUser });
  } catch (error) {
    console.error("DELETE /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
