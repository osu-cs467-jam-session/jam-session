/**
 * User API Routes
 * Handles CRUD operations for user accounts.
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/app/lib/database";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "@/app/models/user";
import mongoose from "mongoose";

/** GET: Fetch users: all or by id */
export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    // Get user by id
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, error: "Invalid ID format" },
          { status: 400 }
        );
      }
      const user = await getUserById(id);
      if (!user)
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );

      // Exclude password hash before returning
      const { hashedPassword: _hashedPassword, ...safeUser } = user;
      return NextResponse.json({ success: true, data: safeUser });
    }

    // Get all users w/ hidden password
    const users = await getUsers();
    const safeUsers = users.map(({ hashedPassword: _hashedPassword, ...rest }) => rest);
    return NextResponse.json({ success: true, data: safeUsers });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/** POST: Create new user abd hash password before saving */
export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    // Hash password before storing
    const hashed = await bcrypt.hash(body.password, 10);

    const newUser = await createUser({
      username: body.username,
      hashedPassword: hashed,
      instrumentsArray: body.instrumentsArray,
      preferredGenre: body.preferredGenre,
      location: body.location,
      contact: body.contact,
    });

    // Hide hashed password
    const { hashedPassword: _hashedPassword, ...safeUser } = newUser;
    return NextResponse.json({ success: true, data: safeUser }, { status: 201 });
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

    // Validate id
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

    // Exclude hashed password
    const { hashedPassword: _hashedPassword, ...safeUser } = updatedUser;
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
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    // Validate id
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

    // Exclude hashed password
    const { hashedPassword: _hashedPassword, ...safeUser } = deletedUser;
    return NextResponse.json({ success: true, data: safeUser });
  } catch (error) {
    console.error("DELETE /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
