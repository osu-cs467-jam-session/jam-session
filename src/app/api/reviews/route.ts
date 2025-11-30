import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/app/lib/database";
import {
  createReview,
  getReviews,
  getReviewById,
  getReviewsByPostId,
  updateReview,
  deleteReview,
} from "@/app/models/review";
import Profile from "@/app/models/profile";

// GET: fetch reviews (all, by id, or by postId)
export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const postId = searchParams.get("postId");

  try {
    // get review by id
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, error: "Invalid ID format" },
          { status: 400 }
        );
      }
      const review = await getReviewById(id);
      if (!review)
        return NextResponse.json(
          { success: false, error: "Review not found" },
          { status: 404 }
        );
      return NextResponse.json({ success: true, data: review });
    }

    // get reviews by postId
    if (postId) {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return NextResponse.json(
          { success: false, error: "Invalid postId format" },
          { status: 400 }
        );
      }
      const reviews = await getReviewsByPostId(postId);
      return NextResponse.json({ success: true, data: reviews });
    }

    // get all reviews
    const reviews = await getReviews();
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST: create new review
export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    if (!body.reviewerClerkUserId || typeof body.reviewerClerkUserId !== 'string') {
      return NextResponse.json(
        { success: false, error: "Invalid userId" },
        { status: 400 }
      );
    }

    if (!body.postId || !mongoose.Types.ObjectId.isValid(body.postId)) {
      return NextResponse.json(
        { success: false, error: "Invalid postId" },
        { status: 400 }
      );
    }

    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    let reviewerUserName = body.reviewerUserName;
    if (!reviewerUserName) {
      try {
        const profile = await Profile.findOne({ clerkUserId: body.reviewerClerkUserId }).lean() as { username?: string } | null;
        reviewerUserName = profile?.username;
      } catch (err) {
        console.log("Could not fetch username:", err);
      }
    }

    const newReview = await createReview({
      _id: new mongoose.Types.ObjectId(),
      postId: new mongoose.Types.ObjectId(body.postId),
      reviewerClerkUserId: body.reviewerClerkUserId,
      reviewerUserName: reviewerUserName,
      rating: body.rating,
      comment: body.comment || undefined,
      date: new Date(),
    });

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// PUT: update existing review
export async function PUT(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();

    if (!body._id || !mongoose.Types.ObjectId.isValid(body._id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    if (!body.reviewerClerkUserId) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    const existingReview = await getReviewById(body._id);
    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    if (existingReview.reviewerClerkUserId !== body.reviewerClerkUserId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (body.rating !== undefined && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const updatedReview = await updateReview(body._id, body);
    return NextResponse.json({ success: true, data: updatedReview });
  } catch (error) {
    console.error("PUT /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE: remove review by id
export async function DELETE(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    const existingReview = await getReviewById(id);
    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    if (existingReview.reviewerClerkUserId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const deletedReview = await deleteReview(id);
    return NextResponse.json({ success: true, data: deletedReview });
  } catch (error) {
    console.error("DELETE /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 }
    );
  }
}

