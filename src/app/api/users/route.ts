// THIS IS A MOCK VERSION WITHOUT MONGOOSE INCORPORTED

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

let users = [
  {
    _id: "1",
    username: "jamfan",
    password: "$2a$10$abc123", // fake hashed
    instrumentsArray: ["Guitar", "Bass"],
    preferredGenre: "Rock",
    location: "Nashville",
    contact: "jamfan@example.com",
  },
];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const exists = users.find((u) => u.username === body.username);
  if (exists) return NextResponse.json({ error: "Username already exists" }, { status: 400 });

  const id = String(users.length + 1);
  const hashed = await bcrypt.hash(body.password, 10);
  const newUser = { ...body, _id: id, password: hashed };
  users.push(newUser);

  return NextResponse.json(newUser, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const index = users.findIndex((u) => u._id === body._id);
  if (index === -1) return NextResponse.json({ error: "User not found" }, { status: 404 });

  users[index] = { ...users[index], ...body };
  return NextResponse.json(users[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  users = users.filter((u) => u._id !== id);
  return NextResponse.json({ message: "User deleted" });
}


// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/app/lib/mongoose";
// import User from "@/app/models/user";
// import bcrypt from "bcryptjs";

// // GET all users
// export async function GET() {
//   await connectToDatabase();
//   const users = await User.find().select("-password");
//   return NextResponse.json(users);
// }

// // POST new user (Register)
// export async function POST(request: Request) {
//   const body = await request.json();
//   await connectToDatabase();
//   const existing = await User.findOne({ username: body.username });
//   if (existing) return NextResponse.json({ error: "Username already exists" }, { status: 400 });

//   const hashed = await bcrypt.hash(body.password, 10);
//   const user = await User.create({ ...body, password: hashed });
//   return NextResponse.json(user, { status: 201 });
// }

// // PUT update user
// export async function PUT(request: Request) {
//   const body = await request.json();
//   await connectToDatabase();
//   const updated = await User.findByIdAndUpdate(body._id, body, { new: true });
//   return NextResponse.json(updated);
// }

// // DELETE user
// export async function DELETE(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");
//   await connectToDatabase();
//   await User.findByIdAndDelete(id);
//   return NextResponse.json({ message: "User deleted" });
// }
