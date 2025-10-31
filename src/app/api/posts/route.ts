/**
 * Post API Routes
 * Handles CRUD operations for user posts.
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/app/lib/database";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "@/app/models/post";

/** GET: Fetch posts: all, by ID, or by userId */
export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");

  try {
    // Get post by id
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, error: "Invalid ID format" },
          { status: 400 }
        );
      }
      const post = await getPostById(id);
      if (!post)
        return NextResponse.json(
          { success: false, error: "Post not found" },
          { status: 404 }
        );
      return NextResponse.json({ success: true, data: post });
    }

    // Get posts by userId
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { success: false, error: "Invalid userId format" },
          { status: 400 }
        );
      }
      const posts = await getPosts();
      const userPosts = posts.filter(
        (p) => p.userId.toString() === userId.toString()
      );
      return NextResponse.json({ success: true, data: userPosts });
    }

    // Get all posts
    const posts = await getPosts();
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

/** POST: Create a new post */
export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    // Validate user id
    if (!body.userId || !mongoose.Types.ObjectId.isValid(body.userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    // Create new post
    const newPost = await createPost({
      _id: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(body.userId),
      title: body.title,
      body: body.body,
      tags: body.tags || [],
      date: new Date(),
    });

    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}

/** PUT: Update an existing post */
export async function PUT(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    // Validate post id
    if (!body._id || !mongoose.Types.ObjectId.isValid(body._id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    const updatedPost = await updatePost(body._id, body);
    if (!updatedPost)
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error("PUT /api/posts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update post" },
      { status: 500 }
    );
  }
}

/** DELETE: Remove a post by id */
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

    const deletedPost = await deletePost(id);
    if (!deletedPost)
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: deletedPost });
  } catch (error) {
    console.error("DELETE /api/posts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
