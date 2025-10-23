import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongoose";
import User from "@/app/models/user";
import bcrypt from "bcryptjs";

export async function GET() {
  await connectToDatabase();
  const users = await User.find().select("-password");
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  await connectToDatabase();
  const existing = await User.findOne({ username: body.username });
  if (existing) return NextResponse.json({ error: "Username already exists" }, { status: 400 });

  const hashed = await bcrypt.hash(body.password, 10);
  const user = await User.create({ ...body, password: hashed });
  return NextResponse.json(user, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  await connectToDatabase();
  const updated = await User.findByIdAndUpdate(body._id, body, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await connectToDatabase();
  await User.findByIdAndDelete(id);
  return NextResponse.json({ message: "User deleted" });
}
