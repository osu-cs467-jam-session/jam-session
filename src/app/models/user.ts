import mongoose from "mongoose";
import { connectToDatabase } from "@/app/lib/database";
import { convertStringIdToObjectId } from "./helper_functions";
export interface IUser {
    _id?: mongoose.Types.ObjectId; // MongoDB ObjectId
    username: string;
    hashedPassword: string;
    instrumentsArray: string[];
    preferredGenre?: string;
    location?: string;
    contact?: string;
    experienceLevel?: string; // "amateur" | "advanced amateur" | "proficient" | "gigging" | "professional"
    clerkId?: string; // Link to Clerk user ID
}

// user schema
const UserSchema = new mongoose.Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        hashedPassword: { type: String, required: true },
        instrumentsArray: { type: [String], required: true },
        preferredGenre: { type: String },
        location: { type: String },
        contact: { type: String },
        experienceLevel: { type: String },
        clerkId: { type: String, unique: true, sparse: true }, // Sparse index allows null values
    }
);

// prevent model overwrite on hot reload
const UserModel = mongoose.models.User as mongoose.Model<IUser>
    || mongoose.model<IUser>("User", UserSchema);

// create
export async function createUser(data: IUser): Promise<IUser> {
    await connectToDatabase();
    try {
        const created = await UserModel.create({
            username: data.username,
            hashedPassword: data.hashedPassword,
            instrumentsArray: data.instrumentsArray,
            preferredGenre: data.preferredGenre,
            location: data.location,
            contact: data.contact,
            experienceLevel: data.experienceLevel,
            clerkId: data.clerkId,
        });

        return (created.toObject && created.toObject()) as unknown as IUser;
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
    }

}

// read
export async function getUsers(): Promise<IUser[]> {
    await connectToDatabase();
    try {
        const users = await UserModel.find().lean();
        return users as unknown as IUser[];
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }
}

export async function getUserById(userId: string): Promise<IUser | null> {
    await connectToDatabase();
    try {
        const id = convertStringIdToObjectId(userId);
        const user = await UserModel.findById(id).lean();
        return user as unknown as IUser | null;
    }
    catch (error) {
        console.error(`Error fetching user by id (${userId}):`, error);
        throw new Error("Failed to fetch user by username");
    }
}

export async function getUserByUsername(username: string): Promise<IUser | null> {
    await connectToDatabase();
  try {
    const user = await UserModel.findOne({ username }).lean();
    return user as unknown as IUser | null;
  } catch (error) {
    console.error(`Error fetching user by username (${username}):`, error);
    throw new Error("Failed to fetch user by username");
  }
}

// fetch user by Clerk ID
export async function getUserByClerkId(clerkId: string): Promise<IUser | null> {
    await connectToDatabase();
    try {
        const user = await UserModel.findOne({ clerkId }).lean();
        return user as unknown as IUser | null;
    } catch (error) {
        console.error(`Error fetching user by Clerk ID (${clerkId}):`, error);
        throw new Error("Failed to fetch user by Clerk ID");
    }
}

// update
export async function updateUser(userId: string, update: Partial<IUser>): Promise<IUser | null> {
    await connectToDatabase();
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

// delete
export async function deleteUser(userId: string): Promise<IUser | null> {
    await connectToDatabase();
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
