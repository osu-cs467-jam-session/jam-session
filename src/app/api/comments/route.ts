/**
 * Comment API Routes
 * Handles CRUD operations for user comments.
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/app/lib/database";
import {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
} from "@/app/models/comment";
import Profile from "@/app/models/profile";

/** GET: Fetch comments: all, by ID, or by parentId */
export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const parentId = searchParams.get("parentId");

  try {
    // Get comment by id
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, error: "Invalid comment ID format" },
          { status: 400 }
        );
      }
      const comment = await getCommentById(id);
      if (!comment)
        return NextResponse.json(
          { success: false, error: "Comment not found" },
          { status: 404 }
        );
      return NextResponse.json({ success: true, data: comment });
    }

    // Get comments by parentId
    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return NextResponse.json(
          { success: false, error: "Invalid parentId format" },
          { status: 400 }
        );
      }
      const comments = await getComments();
      const filtered = comments.filter(
        (c) => c.parentId.toString() === parentId.toString()
      );
      return NextResponse.json({ success: true, data: filtered });
    }

    // Get all comments
    const comments = await getComments();
    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error("GET /api/comments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

/** POST: Create new comment */
export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    // validate parentId
    if (!body.parentId || !mongoose.Types.ObjectId.isValid(body.parentId)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing parentId" },
        { status: 400 }
      );
    }

    // userClerkId is optional (for anonymous comments)
    const userClerkId: string | undefined = body.userClerkId;

    // try to get username from profile, fallback to body or undefined
    let userName: string | undefined = body.userName;
    if (userClerkId && !userName) {
      try {
        const profile = await Profile.findOne({ clerkUserId: userClerkId }).lean() as { username?: string; clerkUserId: string } | null;
        if (profile?.username) {
          userName = profile.username;
        }
      } catch (profileError) {
        // if profile lookup fails, just continue without username
        console.log("Could not fetch username from profile:", profileError);
      }
    }

    // Create comment
    const newComment = await createComment({
      _id: new mongoose.Types.ObjectId(),
      userClerkId: userClerkId,
      userName: userName,
      parentType: body.parentType || "Post",
      parentId: new mongoose.Types.ObjectId(body.parentId),
      comment: body.comment,
      date: new Date(),
    });

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

/** PUT: Update existing comment */
export async function PUT(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    // Validate comment id
    if (!body._id || !mongoose.Types.ObjectId.isValid(body._id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing comment ID" },
        { status: 400 }
      );
    }

    const updatedComment = await updateComment(body._id, body);
    if (!updatedComment)
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: updatedComment });
  } catch (error) {
    console.error("PUT /api/comments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

/** DELETE: Remove comment by id */
export async function DELETE(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    // Validate id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing comment ID" },
        { status: 400 }
      );
    }

    const deleted = await deleteComment(id);
    if (!deleted)
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("DELETE /api/comments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
