import mongoose from "mongoose";

export interface IComment {
    _id: mongoose.Types.ObjectId; // MongoDB ObjectId
    userClerkId?: string; // Clerk user ID (string)
    userName?: string; // Optional username for easy display
    parentType?: "Post" | "AudioUpload"; // Type of the parent entity
    parentId: mongoose.Types.ObjectId; // Reference to the parent entity's ObjectId
    comment: string;
    date?: Date;
}