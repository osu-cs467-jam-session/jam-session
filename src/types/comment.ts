import mongoose from "mongoose";

export interface IComment {
    _id: mongoose.Types.ObjectId; // MongoDB ObjectId
    userId?: mongoose.Types.ObjectId; // Reference to User's ObjectId
    parentType?: "Post" | "AudioUpload"; // Type of the parent entity
    parentId: mongoose.Types.ObjectId; // Reference to the parent entity's ObjectId
    comment: string;
    date?: Date;
}