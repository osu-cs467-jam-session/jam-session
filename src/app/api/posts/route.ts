// THIS IS A MOCK VERSION WITHOUT MONGOOSE INCORPORTED

import { NextResponse } from "next/server";

let posts = [
  {
    _id: "1",
    userId: "1",
    date: new Date().toISOString(),
    title: "Looking for a drummer",
    body: "Need a rock drummer for weekend jam sessions.",
    tags: ["Rock", "Drums"],
  },
];

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newPost = { _id: String(posts.length + 1), date: new Date().toISOString(), ...body };
  posts.push(newPost);
  return NextResponse.json(newPost, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const index = posts.findIndex((p) => p._id === body._id);
  if (index === -1) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  posts[index] = { ...posts[index], ...body };
  return NextResponse.json(posts[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  posts = posts.filter((p) => p._id !== id);
  return NextResponse.json({ message: "Post deleted" });
}


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
