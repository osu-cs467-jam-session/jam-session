import mongoose from "mongoose";

export function convertStringIdToObjectId(id: string): mongoose.Types.ObjectId {
    // Convert string data type to ObjectId Mongoose type
    try {
        return new mongoose.Types.ObjectId(id);
    }
    catch (error) {
        console.error(`Invalid ObjectId string: ${id}`, error);
        throw new Error("Invalid ObjectId string");
    }
}