import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_AUDIO_MIME_PREFIX = "audio/";

function sanitizeFilename(name: string): string {
  const base = name.split("/").pop()?.split("\\").pop() || "audio";
  return base
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const formUserId = formData.get("userId")?.toString();

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid file field" },
        { status: 400 }
      );
    }

    // Clerk userId (fallback to form)
    const { userId: clerkUserId } = await auth();
    const userId = formUserId || clerkUserId || "anonymous";

    // file size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Max size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`,
        },
        { status: 400 }
      );
    }

    // MIME type validation
    const mimeType = file.type || "application/octet-stream";
    if (!mimeType.startsWith(ALLOWED_AUDIO_MIME_PREFIX)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only audio files allowed." },
        { status: 400 }
      );
    }

    // Create safe filename
    const originalName = sanitizeFilename(file.name || "audio");
    const timestamp = Date.now();
    const finalPath = `audio/${userId}/${timestamp}-${originalName}`;

    // Convert file → buffer (required by put())
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Vercel Blob
    const { url, pathname } = await put(finalPath, buffer, {
      access: "public",
      contentType: mimeType,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          filePath: pathname, // stored reference
          url,               // public URL for playback
          mimeType,
          userId,
          originalName,
          size: file.size,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/audio_uploads/upload ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload audio file" },
      { status: 500 }
    );
  }
}
