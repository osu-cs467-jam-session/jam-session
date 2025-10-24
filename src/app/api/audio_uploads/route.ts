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
