import mongoose from "mongoose";
import { convertStringIdToObjectId } from "./helper_functions";

// Define Types
export interface IAudioUpload {
    _id: mongoose.Types.ObjectId; // MongoDB ObjectId
    userId: mongoose.Types.ObjectId; // Reference to User's ObjectId
    filename: string;
    title: string;
    date?: Date;
    tags?: string[];
}

// AudioUpload schema
const AudioUploadSchema = new mongoose.Schema<IAudioUpload>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        filename: { type: String, required: true },
        title: { type: String, required: true },
        date: { type: Date, default: Date.now },
        tags: { type: [String], default: [] }
    }
);

// Use existing model if it exists (prevents OverwriteModelError during hot reload)
const AudioUploadModel = mongoose.models.AudioUpload as mongoose.Model<IAudioUpload>
    || mongoose.model<IAudioUpload>("AudioUpload", AudioUploadSchema);

// Create Operations
export async function createAudioUpload(data: IAudioUpload): Promise<IAudioUpload> {
    try {
        const created = await AudioUploadModel.create(data);
        return created;
    }
    catch (error) {
        console.error("Error creating audio upload:", error);
        throw new Error("Failed to create audio upload");
    }
}

// Read Operations
export async function getAudioUploads(): Promise<IAudioUpload[]> {
    try {
        const uploads = await AudioUploadModel.find().lean();
        return uploads as unknown as IAudioUpload[];
    }
    catch (error) {
        console.error("Error fetching audio uploads:", error);
        throw new Error("Failed to fetch audio uploads");
    }
}

export async function getAudioUploadById(id: string): Promise<IAudioUpload | null> {
    try {
        const objectId = convertStringIdToObjectId(id);
        const upload = await AudioUploadModel.findById(objectId).lean();
        return upload as unknown as IAudioUpload | null;
    }
    catch (error) {
        console.error("Error fetching audio upload by ID:", error);
        throw new Error("Failed to fetch audio upload by ID");
    }
}

// Update Operations
export async function updateAudioUpload(id: string, data: Partial<IAudioUpload>): Promise<IAudioUpload | null> {
    try {
        const objectId = convertStringIdToObjectId(id);
        const updated = await AudioUploadModel.findByIdAndUpdate(objectId, data, { new: true }).lean();
        return updated as unknown as IAudioUpload | null;
    }
    catch (error) {
        console.error("Error updating audio upload:", error);
        throw new Error("Failed to update audio upload");
    }
}

// Delete Operations
export async function deleteAudioUpload(id: string): Promise<IAudioUpload | null> {
    try {
        const objectId = convertStringIdToObjectId(id);
        const deleted = await AudioUploadModel.findByIdAndDelete(objectId).lean();
        return deleted as unknown as IAudioUpload | null;
    }
    catch (error) {
        console.error("Error deleting audio upload:", error);
        throw new Error("Failed to delete audio upload");
    }
}