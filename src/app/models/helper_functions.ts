import mongoose from "mongoose";

export function convertStringIdToObjectId(id: string): mongoose.Types.ObjectId {
    // convert string to ObjectId
    try {
        return new mongoose.Types.ObjectId(id);
    }
    catch (error) {
        console.error(`Invalid ObjectId string: ${id}`, error);
        throw new Error("Invalid ObjectId string");
    }
}