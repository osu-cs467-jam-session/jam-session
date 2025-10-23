// THIS IS A MOCK VERSION WITHOUT MONGOOSE INCORPORTED

import { NextResponse } from "next/server";

let uploads = [
  {
    _id: "1",
    userId: "1",
    date: new Date().toISOString(),
    title: "Guitar riff test",
    file: "mock_audio_url.mp3",
    tags: ["Guitar", "Demo"],
  },
];

export async function GET() {
  return NextResponse.json(uploads);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newUpload = { _id: String(uploads.length + 1), date: new Date().toISOString(), ...body };
  uploads.push(newUpload);
  return NextResponse.json(newUpload, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const index = uploads.findIndex((a) => a._id === body._id);
  if (index === -1) return NextResponse.json({ error: "Upload not found" }, { status: 404 });
  uploads[index] = { ...uploads[index], ...body };
  return NextResponse.json(uploads[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  uploads = uploads.filter((a) => a._id !== id);
  return NextResponse.json({ message: "Audio upload deleted" });
}


// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/app/lib/mongoose";
// import AudioUpload from "@/app/models/audio_upload";

// export async function GET() {
//   await connectToDatabase();
//   const uploads = await AudioUpload.find().populate("userId", "username");
//   return NextResponse.json(uploads);
// }

// export async function POST(request: Request) {
//   const body = await request.json();
//   await connectToDatabase();
//   const upload = await AudioUpload.create(body);
//   return NextResponse.json(upload, { status: 201 });
// }

// export async function PUT(request: Request) {
//   const body = await request.json();
//   await connectToDatabase();
//   const updated = await AudioUpload.findByIdAndUpdate(body._id, body, { new: true });
//   return NextResponse.json(updated);
// }

// export async function DELETE(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");
//   await connectToDatabase();
//   await AudioUpload.findByIdAndDelete(id);
//   return NextResponse.json({ message: "Audio upload deleted" });
// }
