/**
 * User Password API Route
 * Handles password updates separately for security.
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/app/lib/database";
import { getUserById, updateUser, IUser } from "@/app/models/user";
import mongoose from "mongoose";

export type SafeUser = Omit<IUser, "hashedPassword">;

function excludeHashedPassword(user: IUser): SafeUser {
  const { hashedPassword, ...rest } = user;
  return rest;
}

/** PUT: Update user password (dedicated endpoint) */
export async function PUT(request: Request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { _id, newPassword } = body;

    // Validate id
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    // Validate new password
    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid newPassword" },
        { status: 400 }
      );
    }

    const existingUser = await getUserById(_id);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Only update hashedPassword here
    const updatedUser = await updateUser(_id, {
      hashedPassword: hashed,
    } as Partial<IUser>);

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "Failed to update password" },
        { status: 500 }
      );
    }

    const safeUser = excludeHashedPassword(updatedUser);
    return NextResponse.json(
      {
        success: true,
        data: safeUser,
        message: "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/users/password error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update password" },
      { status: 500 }
    );
  }
}
