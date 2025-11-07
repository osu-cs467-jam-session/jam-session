// src/lib/database.ts
import mongoose from "mongoose";

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI as string;
const DB_NAME = process.env.DB_NAME as string;

if (!MONGODB_URI) {
  throw new Error(
    "⚠️ Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// ------------------------------
// Mongoose connection caching
// ------------------------------
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { dbName: DB_NAME, bufferCommands: false })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ------------------------------
// User model & helper function
// ------------------------------
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  contact: String,
  instruments: [String],
  location: String,
  preferredGenre: String,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

/**
 * Fetch a user by their username.
 */
export async function getUserByUsername(username: string) {
  await connectToDatabase();
  return User.findOne({ username }).lean();
}
