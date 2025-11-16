/**
 * Audio Upload API Routes
 * Handles CRUD operations for audio uploads.
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/app/lib/database";
import {
  createAudioUpload,
  getAudioUploads,
  getAudioUploadById,
  updateAudioUpload,
  deleteAudioUpload,
} from "@/app/models/audio_upload";

/** GET: Get audio uploads: all, by id, or by userId */
export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");

  // Pagination + filtering additions
  const cursor = searchParams.get("cursor");
  const limitParam = searchParams.get("limit");
  const search = searchParams.get("search"); // search in title/tags
  const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 10, 50) : 10;

  try {
    // Get by ID
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, error: "Invalid ID format" },
          { status: 400 }
        );
      }
      const upload = await getAudioUploadById(id);
      if (!upload)
        return NextResponse.json(
          { success: false, error: "Audio upload not found" },
          { status: 404 }
        );
      return NextResponse.json({ success: true, data: upload });
    }

    // Get by userId
    // OLD: no pagination or search
    // if (userId) {
    //   if (!mongoose.Types.ObjectId.isValid(userId)) {
    //     return NextResponse.json(
    //       { success: false, error: "Invalid userId format" },
    //       { status: 400 }
    //     );
    //   }
    //   const uploads = await getAudioUploads();
    //   const userUploads = uploads.filter(
    //     (u) => u.userId.toString() === userId.toString()
    //   );
    //   return NextResponse.json({ success: true, data: userUploads });
    // }

    // Get all uploads
    // const uploads = await getAudioUploads();
    // return NextResponse.json({ success: true, data: uploads });

    // Pagination + filtering additions (replacing block above)
    let uploads = await getAudioUploads();

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { success: false, error: "Invalid userId format" },
          { status: 400 }
        );
      }
      uploads = uploads.filter(
        (u) => u.userId?.toString() === userId.toString()
      );
    }

    if (search) {
      const lower = search.toLowerCase();
      uploads = uploads.filter((u) => {
        const titleMatch = u.title?.toLowerCase().includes(lower);
        const tagsMatch = (u.tags || []).some((tag) =>
          tag.toLowerCase().includes(lower)
        );
        return titleMatch || tagsMatch;
      });
    }

    uploads.sort((a, b) => {
      const aId = a._id ? a._id.toString() : "";
      const bId = b._id ? b._id.toString() : "";
      return aId.localeCompare(bId);
    });

    let startIndex = 0;
    if (cursor) {
      const idx = uploads.findIndex((u) => u._id?.toString() === cursor);
      if (idx >= 0) {
        startIndex = idx + 1;
      }
    }

    const pageItems = uploads.slice(startIndex, startIndex + limit);
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
    console.error("GET /api/audio_uploads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch audio uploads" },
      { status: 500 }
    );
  }
}

/** POST: Create new audio upload */
export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();
    if (!body.userId || !mongoose.Types.ObjectId.isValid(body.userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    const newUpload = await createAudioUpload({
      _id: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(body.userId),
      filename: body.filename,
      title: body.title,
      tags: body.tags || [],
      date: new Date(),
    });

    return NextResponse.json({ success: true, data: newUpload }, { status: 201 });
  } catch (error) {
    console.error("POST /api/audio_uploads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create audio upload" },
      { status: 500 }
    );
  }
}

/** PUT: Update existing audio upload */
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

    const updated = await updateAudioUpload(body._id, body);
    if (!updated)
      return NextResponse.json(
        { success: false, error: "Audio upload not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/audio_uploads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update audio upload" },
      { status: 500 }
    );
  }
}

/** DELETE: Remove audio upload by id */
export async function DELETE(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    const deleted = await deleteAudioUpload(id);
    if (!deleted)
      return NextResponse.json(
        { success: false, error: "Audio upload not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("DELETE /api/audio_uploads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete audio upload" },
      { status: 500 }
    );
  }
}
