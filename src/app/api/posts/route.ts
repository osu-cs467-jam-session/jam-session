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
import Profile from "@/app/models/profile";

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

    // Validate user id (must be Clerk ID string)
    if (!body.userId || typeof body.userId !== 'string') {
      return NextResponse.json(
        { success: false, error: "Invalid or missing userId (must be Clerk ID)" },
        { status: 400 }
      );
    }

    // userId is Clerk ID (string) - this is the clerkUserId
    const userId: string = body.userId;

    // Try to fetch username from profile using clerkUserId
    let userName: string | undefined = body.userName;
    if (!userName) {
      try {
        const profile = await Profile.findOne({ clerkUserId: userId }).lean() as { username?: string; clerkUserId: string } | null;
        if (profile?.username) {
          userName = profile.username;
        }
      } catch (profileError) {
        // If profile lookup fails, continue without username
        console.log("Could not fetch username from profile:", profileError);
      }
    }

    // Create new post
    const newPost = await createPost({
      _id: new mongoose.Types.ObjectId(),
      userId: userId, // Clerk ID (clerkUserId) as string
      userName: userName, // Optional username from profile or request
      title: body.title,
      body: body.body,
      tags: body.tags || [],
      date: new Date(),
      audioUploadId: body.audioUploadId ? new mongoose.Types.ObjectId(body.audioUploadId) : undefined,
      albumArtUrl: body.albumArtUrl || undefined,
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
