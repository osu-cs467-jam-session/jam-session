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

  // Pagination and filtering additions
  const cursor = searchParams.get("cursor"); 
  const limitParam = searchParams.get("limit");
  const search = searchParams.get("search"); // optional text search in title/body/tags
  const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 10, 50) : 10;

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
    // OLD: no pagination or search
    // if (userId) {
    //   if (!mongoose.Types.ObjectId.isValid(userId)) {
    //     return NextResponse.json(
    //       { success: false, error: "Invalid userId format" },
    //       { status: 400 }
    //     );
    //   }
    //   const posts = await getPosts();
    //   const userPosts = posts.filter(
    //     (p) => p.userId.toString() === userId.toString()
    //   );
    //   return NextResponse.json({ success: true, data: userPosts });
    // }

    // Get all posts
    // const posts = await getPosts();
    // return NextResponse.json({ success: true, data: posts });

    // Pagination and filtering additions (replacing block above)
    let posts = await getPosts();

    // Filter by userId if provided
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { success: false, error: "Invalid userId format" },
          { status: 400 }
        );
      }
      posts = posts.filter(
        (p) => p.userId?.toString() === userId.toString()
      );
    }

    // Optional text search in title/body/tags
    if (search) {
      const lower = search.toLowerCase();
      posts = posts.filter((p) => {
        const titleMatch = p.title?.toLowerCase().includes(lower);
        const bodyMatch = p.body?.toLowerCase().includes(lower);
        const tagsMatch = (p.tags || []).some((tag) =>
          tag.toLowerCase().includes(lower)
        );
        return titleMatch || bodyMatch || tagsMatch;
      });
    }

    // Sort by _id for stable cursor ordering
    posts.sort((a, b) => {
      const aId = a._id ? a._id.toString() : "";
      const bId = b._id ? b._id.toString() : "";
      return aId.localeCompare(bId);
    });

    // Apply cursor
    let startIndex = 0;
    if (cursor) {
      const idx = posts.findIndex((p) => p._id?.toString() === cursor);
      if (idx >= 0) {
        startIndex = idx + 1;
      }
    }

    const pageItems = posts.slice(startIndex, startIndex + limit);
    const nextCursor =
      pageItems.length === limit && pageItems[pageItems.length - 1]?._id
        ? pageItems[pageItems.length - 1]._id!.toString()
        : null;

    return NextResponse.json({
      success: true,
      data: pageItems,
      count: pageItems.length,
      nextCursor,
    });
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
