// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/app/lib/mongoose";
// import Post from "@/app/models/post";

// export async function GET() {
//   await connectToDatabase();
//   const posts = await Post.find().populate("userId", "username");
//   return NextResponse.json(posts);
// }

// export async function POST(request: Request) {
//   const body = await request.json();
//   await connectToDatabase();
//   const post = await Post.create(body);
//   return NextResponse.json(post, { status: 201 });
// }

// export async function PUT(request: Request) {
//   const body = await request.json();
//   await connectToDatabase();
//   const updated = await Post.findByIdAndUpdate(body._id, body, { new: true });
//   return NextResponse.json(updated);
// }

// export async function DELETE(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");
//   await connectToDatabase();
//   await Post.findByIdAndDelete(id);
//   return NextResponse.json({ message: "Post deleted" });
// }
