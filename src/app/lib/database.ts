// Reusable Mongo Connection with Mongoose

// lib/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI as string;
const DB_NAME = process.env.DB_NAME as string;

if (!MONGODB_URI) {
    throw new Error("⚠️ Please define the MONGODB_URI environment variable inside .env.local");
}

/*
 * Global is used here to prevent multiple connections in dev mode.
 * In production, this isn't needed because Next.js won't hot reload.
 */


interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? {
    conn: null,
    promise: null,
};

global.mongoose = cached;

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: DB_NAME,
            bufferCommands: false,
        }).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}