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
    // Expect the caller to pass plaintext password; hashing should be done before saving.
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

export async function getUserByUsername(username: string): Promise<IUser | null> {
    try {
        const user = await UserModel.findOne({ username }).lean();
        return user;
    }
    catch (error) {
        console.error(`Error fetching user by username (${username}):`, error);
        throw new Error("Failed to fetch user by username");
    }
}

// Update Operations

export async function updateUser(id: string, update: Partial<IUser>): Promise<IUser | null> {
    const updated = await UserModel.findByIdAndUpdate(id, update, { new: true }).lean().exec();
    return (updated as unknown) as IUser | null;
}

// Delete Operations

export async function deleteUser(id: string): Promise<IUser | null> {
    const res = await UserModel.findByIdAndDelete(id).lean().exec();
    return (res as unknown) as IUser | null;
}


export default UserModel;
