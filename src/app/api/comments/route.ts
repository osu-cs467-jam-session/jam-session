// THIS IS A MOCK VERSION WITHOUT MONGOOSE INCORPORTED

import { NextResponse } from "next/server";

let comments = [
  { _id: "1", postId: "1", userId: "1", comment: "Count me in!" },
];

export async function GET() {
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newComment = { _id: String(comments.length + 1), ...body };
  comments.push(newComment);
  return NextResponse.json(newComment, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const index = comments.findIndex((c) => c._id === body._id);
  if (index === -1) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  comments[index] = { ...comments[index], ...body };
  return NextResponse.json(comments[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  comments = comments.filter((c) => c._id !== id);
  return NextResponse.json({ message: "Comment deleted" });
}


// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/app/lib/mongoose";
// import Comment from "@/app/models/comment";

// export async function GET() {
//   await connectToDatabase();
//   const comments = await Comment.find().populate("postId", "title");
//   return NextResponse.json(comments);
// }

// export async function POST(request: Request) {
//   const body = await request.json();
//   await connectToDatabase();
//   const comment = await Comment.create(body);
//   return NextResponse.json(comment, { status: 201 });
// }

// export async function PUT(request: Request) {
//   const body = await request.json();
//   await connectToDatabase();
//   const updated = await Comment.findByIdAndUpdate(body._id, body, { new: true });
//   return NextResponse.json(updated);
// }

// export async function DELETE(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");
//   await connectToDatabase();
//   await Comment.findByIdAndDelete(id);
//   return NextResponse.json({ message: "Comment deleted" });
// }
