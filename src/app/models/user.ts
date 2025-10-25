// Code was adapted from GPT-5 mini model on 10/22/2025

import mongoose from "mongoose";

// User shape used by the app
export interface IUser {
    _id?: mongoose.Types.ObjectId; // MongoDB ObjectId
    username: string;
    hashedPassword: string;
    instrumentsArray: string[];
    preferredGenre?: string;
    location?: string;
    contact?: string;
}

function convertStringIdToObjectId(id: string): mongoose.Types.ObjectId {
    // Convert string data type to ObjectId Mongoose type
    try {
        return new mongoose.Types.ObjectId(id);
    }
    catch (error) {
        console.error(`Invalid ObjectId string: ${id}`, error);
        throw new Error("Invalid ObjectId string");
    }
}

// User schema (use default ObjectId _id provided by MongoDB)
const UserSchema = new mongoose.Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        hashedPassword: { type: String, required: true },
        instrumentsArray: { type: [String], required: true },
        preferredGenre: { type: String },
        location: { type: String },
        contact: { type: String },
    }
);

// Use existing model if it exists (prevents OverwriteModelError during hot reload)
const UserModel = mongoose.models.User as mongoose.Model<IUser>
    || mongoose.model<IUser>("User", UserSchema);

// Create Operations
export async function createUser(data: {
    username: string;
    password: string;
    instrumentsArray: string[];
    preferredGenre?: string;
    location?: string;
    contact?: string;
}): Promise<IUser> {
    try {
        const created = await UserModel.create({
            username: data.username,
            hashedPassword: data.password,
            instrumentsArray: data.instrumentsArray,
            preferredGenre: data.preferredGenre,
            location: data.location,
            contact: data.contact,
        });

        return (created.toObject && created.toObject()) as unknown as IUser;
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
    }

}

// Read Operations
export async function getUsers(): Promise<IUser[]> {
    try {
        const users = await UserModel.find().lean();
        return users;
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }
}

export async function getUserById(userId: string): Promise<IUser | null> {
    try {
        // Convert string to ObjectId type
        const id = convertStringIdToObjectId(userId);
        const user = await UserModel.findOne({ id }).lean();
        return user;
    }
    catch (error) {
        console.error(`Error fetching user by id (${userId}):`, error);
        throw new Error("Failed to fetch user by username");
    }
}

// Update Operations
export async function updateUser(userId: string, update: Partial<IUser>): Promise<IUser | null> {
    try {
        const id = convertStringIdToObjectId(userId);
        const updated = await UserModel.findByIdAndUpdate(id, update, { new: true }).lean();
        return (updated as unknown) as IUser | null;
    }
    catch (error) {
        console.error(`Error updating user (${userId}):`, error);
        throw new Error("Failed to update user");
    }
}

// Delete Operations
export async function deleteUser(userId: string): Promise<IUser | null> {
    try {
        const id = convertStringIdToObjectId(userId);
        const user = await UserModel.findByIdAndDelete(id).lean();
        return (user as unknown) as IUser | null;
    }
    catch (error) {
        console.error(`Error deleting user (${userId}):`, error);
        throw new Error("Failed to delete user");
    }
}


export default UserModel;
