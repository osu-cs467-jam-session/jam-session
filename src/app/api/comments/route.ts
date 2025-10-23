import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongoose";
import Comment from "@/app/models/comment";

export async function GET() {
  await connectToDatabase();
  const comments = await Comment.find().populate("postId", "title");
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const body = await request.json();
  await connectToDatabase();
  const comment = await Comment.create(body);
  return NextResponse.json(comment, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  await connectToDatabase();
  const updated = await Comment.findByIdAndUpdate(body._id, body, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await connectToDatabase();
  await Comment.findByIdAndDelete(id);
  return NextResponse.json({ message: "Comment deleted" });
}
