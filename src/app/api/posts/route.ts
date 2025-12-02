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

// GET: fetch posts (all, by id, by userId, or filtered)
export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");
  
  // filter params
  const instruments = searchParams.getAll("instrument");
  const skill = searchParams.get("skill");
  const genres = searchParams.getAll("genre");
  const search = searchParams.get("search");

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

    // Get all posts first
    let posts = await getPosts();

    // Filter by userId if provided
    if (userId) {
      posts = posts.filter(
        (p) => p.userId.toString() === userId.toString()
      );
    }

    // Apply filters
    if (instruments.length > 0 || skill || genres.length > 0 || search) {
      posts = posts.filter((post) => {
        const tags = post.tags || [];
        
        // filter by instruments (OR logic - any match)
        if (instruments.length > 0) {
          const hasInstrument = instruments.some(inst => {
            const tagToFind = `instrument:${inst}`;
            return tags.some(tag => 
              tag.toLowerCase() === tagToFind.toLowerCase()
            );
          });
          if (!hasInstrument) return false;
        }

        // filter by skill (single selection)
        if (skill) {
          const tagToFind = `skill:${skill}`;
          const hasSkill = tags.some(tag => 
            tag.toLowerCase() === tagToFind.toLowerCase()
          );
          if (!hasSkill) return false;
        }

        // filter by genres (OR logic - any match)
        if (genres.length > 0) {
          const hasGenre = genres.some(genre => {
            const tagToFind = `genre:${genre}`;
            return tags.some(tag => 
              tag.toLowerCase() === tagToFind.toLowerCase()
            );
          });
          if (!hasGenre) return false;
        }

        // text search in title and body (case-insensitive)
        if (search) {
          const searchLower = search.toLowerCase();
          const titleMatch = post.title.toLowerCase().includes(searchLower);
          const bodyMatch = post.body.toLowerCase().includes(searchLower);
          if (!titleMatch && !bodyMatch) return false;
        }

        return true;
      });
    }

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST: create a new post
export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    // validate userId (needs to be Clerk ID string)
    if (!body.userId || typeof body.userId !== 'string') {
      return NextResponse.json(
        { success: false, error: "Invalid or missing userId (must be Clerk ID)" },
        { status: 400 }
      );
    }

    const userId: string = body.userId;

    // try to get username from profile, fallback to body or undefined
    let userName: string | undefined = body.userName;
    if (!userName) {
      try {
        const profile = await Profile.findOne({ clerkUserId: userId }).lean() as { username?: string; clerkUserId: string } | null;
        if (profile?.username) {
          userName = profile.username;
        }
      } catch (profileError) {
        // if profile lookup fails, just continue without username
        console.log("Could not fetch username from profile:", profileError);
      }
    }
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

// PUT: update existing post
export async function PUT(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    // validate post id
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

// DELETE: remove post by id
export async function DELETE(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    // validate id
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
