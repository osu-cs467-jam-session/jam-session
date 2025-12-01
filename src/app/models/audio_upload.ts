import mongoose from "mongoose";

export interface IAudioUpload {
  _id: mongoose.Types.ObjectId;
  userId: string;              // Clerk ID string
  filename: string;
  title?: string;
  date?: Date;
  tags?: string[];
  filePath?: string;
  url?: string;
  mimeType?: string;
  originalName?: string;
  size?: number;
}

const AudioUploadSchema = new mongoose.Schema<IAudioUpload>(
  {
    userId: { type: String, required: true },  
    filename: { type: String, required: true },
    title: { type: String },
    date: { type: Date, default: Date.now },
    tags: { type: [String], default: [] },

    // Blob fields
    filePath: { type: String },
    url: { type: String },
    mimeType: { type: String },
    originalName: { type: String },
    size: { type: Number },
  },
  { timestamps: true }
);

// Prevent model overwrite
const AudioUpload =
  mongoose.models.AudioUpload ||
  mongoose.model<IAudioUpload>("AudioUpload", AudioUploadSchema);

// CREATE
export async function createAudioUpload(
  data: IAudioUpload
): Promise<IAudioUpload> {
  try {
    return await AudioUpload.create(data);
  } catch (error) {
    console.error("Error creating audio upload:", error);
    throw new Error("Failed to create audio upload");
  }
}

// READ ALL
export async function getAudioUploads(): Promise<IAudioUpload[]> {
  try {
    return (await AudioUpload.find().lean()) as unknown as IAudioUpload[];
  } catch (error) {
    console.error("Error fetching audio uploads:", error);
    throw new Error("Failed to fetch audio uploads");
  }
}

// READ BY ID
export async function getAudioUploadById(
  id: string
): Promise<IAudioUpload | null> {
  try {
    return (await AudioUpload.findById(id).lean()) as unknown as IAudioUpload | null;
  } catch (error) {
    console.error("Error fetching audio upload by ID:", error);
    throw new Error("Failed to fetch audio upload by ID");
  }
}


// UPDATE
export async function updateAudioUpload(
  id: string,
  data: Partial<IAudioUpload>
): Promise<IAudioUpload | null> {
  try {
    return (await AudioUpload.findByIdAndUpdate(id, data, {
      new: true,
    }).lean()) as unknown as IAudioUpload | null;
  } catch (error) {
    console.error("Error updating audio upload:", error);
    throw new Error("Failed to update audio upload");
  }
}


// DELETE
export async function deleteAudioUpload(
  id: string
): Promise<IAudioUpload | null> {
  try {
    return (await AudioUpload.findByIdAndDelete(id).lean()) as unknown as IAudioUpload | null;
  } catch (error) {
    console.error("Error deleting audio upload:", error);
    throw new Error("Failed to delete audio upload");
  }
}


export default AudioUpload;
