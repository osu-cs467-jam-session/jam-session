import mongoose from "mongoose";
import { convertStringIdToObjectId } from "./helper_functions";

// Define Types
export interface IComment {
    _id: mongoose.Types.ObjectId; // MongoDB ObjectId
    userId: mongoose.Types.ObjectId; // Reference to User's ObjectId
    parentType: "Post" | "AudioUpload"; // Type of the parent entity
    parentId: mongoose.Types.ObjectId; // Reference to the parent entity's ObjectId
    comment: string;
    date?: Date;
}

// Comment schema
const CommentSchema = new mongoose.Schema<IComment>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        parentType: { type: String, enum: ["Post", "AudioUpload"], required: true },
        parentId: { type: mongoose.Schema.Types.ObjectId, required: true },
        comment: { type: String, required: true },
        date: { type: Date, default: Date.now },
    }
);

// Use existing model if it exists (prevents OverwriteModelError during hot reload)
const CommentModel = mongoose.models.Comment as mongoose.Model<IComment>
    || mongoose.model<IComment>("Comment", CommentSchema);

// Create Operations
export async function createComment(data: IComment): Promise<IComment> {
    try {
        const created = await CommentModel.create(data);
        return created;
    }
    catch (error) {
        console.error("Error creating comment:", error);
        throw new Error("Failed to create comment");
    }
}

// Read Operations
export async function getComments(): Promise<IComment[]> {
    try {
        const comments = await CommentModel.find().lean();
        return comments as unknown as IComment[];
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        throw new Error("Failed to fetch comments");
    }
}

export async function getCommentById(id: string): Promise<IComment | null> {
    try {
        const objectId = convertStringIdToObjectId(id);
        const comment = await CommentModel.findById(objectId).lean();
        return comment as unknown as IComment | null;
    }
    catch (error) {
        console.error("Error fetching comment by ID:", error);
        throw new Error("Failed to fetch comment by ID");
    }
}

// Update Operations
export async function updateComment(id: string, data: Partial<IComment>): Promise<IComment | null> {
    try {
        const objectId = convertStringIdToObjectId(id);
        const updated = await CommentModel.findByIdAndUpdate(objectId, data, { new: true }).lean();
        return updated as unknown as IComment | null;
    }
    catch (error) {
        console.error("Error updating comment:", error);
        throw new Error("Failed to update comment");
    }
}

// Delete Operations
export async function deleteComment(id: string): Promise<boolean> {
    try {
        const objectId = convertStringIdToObjectId(id);
        const result = await CommentModel.findByIdAndDelete(objectId);
        return result !== null;
    }
    catch (error) {
        console.error("Error deleting comment:", error);
        throw new Error("Failed to delete comment");
    }
}