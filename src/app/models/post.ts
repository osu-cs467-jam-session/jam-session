
import mongoose from "mongoose";
import { convertStringIdToObjectId } from "./helper_functions";

export interface IPost {
    _id: mongoose.Types.ObjectId; // MongoDB ObjectId
    userId: string; // Clerk ID (clerkUserId) - stored as string
    userName?: string; // Optional username for easy display
    title: string;
    body: string;
    date?: Date;
    tags?: string[]; // Structured tags: ["skill:amateur", "instrument:guitar", "genre:rock"]
    audioUploadId?: mongoose.Types.ObjectId; // Optional reference to AudioUpload
    albumArtUrl?: string; // Optional URL to album art image
}

// post schema
const PostSchema = new mongoose.Schema<IPost>(
    {
        userId: { type: String, required: true }, // Clerk ID (clerkUserId) - stored as string
        userName: { type: String, required: false }, // Optional username for easy display
        title: { type: String, required: true },
        body: { type: String, required: true },
        date: { type: Date, default: Date.now },
        tags: { type: [String], default: [] },
        audioUploadId: { type: mongoose.Schema.Types.ObjectId, ref: "AudioUpload", required: false },
        albumArtUrl: { type: String, required: false },
    }
);

// prevent model overwrite on hot reload
const PostModel = mongoose.models.Post as mongoose.Model<IPost>
    || mongoose.model<IPost>("Post", PostSchema);


// create
export async function createPost(data: IPost): Promise<IPost> {
    try {
        const created = await PostModel.create(data);
        return created;
    }
    catch (error) {
        console.error("Error creating post:", error);
        throw new Error("Failed to create post");
    }
}

// read

export async function getPosts(): Promise<IPost[]> {
    try {
        const posts = await PostModel.find().lean();
        return posts as unknown as IPost[];
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Failed to fetch posts");
    }
}

export async function getPostById(id: string): Promise<IPost | null> {
    try {
        const objectId = convertStringIdToObjectId(id);
        const post = await PostModel.findById(objectId).lean();
        return post;
    }
    catch (error) {
        console.error("Error fetching post by ID:", error);
        throw new Error("Failed to fetch post by ID");
    }
}


// update

export async function updatePost(id: string, data: Partial<IPost>): Promise<IPost | null> {
    try {
        const objectId = convertStringIdToObjectId(id);
        const updated = await PostModel.findByIdAndUpdate(objectId, data, { new: true }).lean();
        return updated;
    }
    catch (error) {
        console.error("Error updating post:", error);
        throw new Error("Failed to update post");
    }
}

// delete

export async function deletePost(id: string): Promise<IPost | null> {
    try {
        const objectId = convertStringIdToObjectId(id);
        const deleted = await PostModel.findByIdAndDelete(objectId).lean();
        return deleted;
    }
    catch (error) {
        console.error("Error deleting post:", error);
        throw new Error("Failed to delete post");
    }
}
