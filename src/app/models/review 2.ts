import mongoose from "mongoose";
import { convertStringIdToObjectId } from "./helper_functions";

export interface IReview {
    _id: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    reviewerClerkUserId: string;
    reviewerUserName?: string;
    rating: number;
    comment?: string;
    date?: Date;
}

// review schema
const ReviewSchema = new mongoose.Schema<IReview>(
    {
        postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
        reviewerClerkUserId: { type: String, required: true },
        reviewerUserName: { type: String, required: false },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: false },
        date: { type: Date, default: Date.now },
    }
);

// prevent model overwrite on hot reload
const ReviewModel = mongoose.models.Review as mongoose.Model<IReview>
    || mongoose.model<IReview>("Review", ReviewSchema);

// create
export async function createReview(data: IReview): Promise<IReview> {
    try {
        const created = await ReviewModel.create(data);
        return created;
    }
    catch (error) {
        console.error("Error creating review:", error);
        throw new Error("Failed to create review");
    }
}

// read
export async function getReviews(): Promise<IReview[]> {
    try {
        const reviews = await ReviewModel.find().lean();
        return reviews as unknown as IReview[];
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        throw new Error("Failed to fetch reviews");
    }
}

export async function getReviewById(id: string): Promise<IReview | null> {
    try {
        const objectId = convertStringIdToObjectId(id);
        const review = await ReviewModel.findById(objectId).lean();
        return review as unknown as IReview | null;
    }
    catch (error) {
        console.error("Error fetching review by ID:", error);
        throw new Error("Failed to fetch review by ID");
    }
}

export async function getReviewsByPostId(postId: string): Promise<IReview[]> {
    try {
        const objectId = convertStringIdToObjectId(postId);
        const reviews = await ReviewModel.find({ postId: objectId }).lean();
        return reviews as unknown as IReview[];
    }
    catch (error) {
        console.error("Error fetching reviews by post ID:", error);
        throw new Error("Failed to fetch reviews by post ID");
    }
}

// update
export async function updateReview(id: string, data: Partial<IReview>): Promise<IReview | null> {
    try {
        const objectId = convertStringIdToObjectId(id);
        const updated = await ReviewModel.findByIdAndUpdate(objectId, data, { new: true }).lean();
        return updated as unknown as IReview | null;
    }
    catch (error) {
        console.error("Error updating review:", error);
        throw new Error("Failed to update review");
    }
}

// delete
export async function deleteReview(id: string): Promise<IReview | null> {
    try {
        const objectId = convertStringIdToObjectId(id);
        const deleted = await ReviewModel.findByIdAndDelete(objectId).lean();
        return deleted as unknown as IReview | null;
    }
    catch (error) {
        console.error("Error deleting review:", error);
        throw new Error("Failed to delete review");
    }
}

