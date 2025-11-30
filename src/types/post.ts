// Frontend types matching backend IPost interface

import mongoose from "mongoose";

export type SkillLevel = "Amateur" | "Advanced Amateur" | "Proficient" | "Intermediate" | "Professional";
export type Instrument = "Drums" | "Bass" | "Guitar" | "Piano" | "Vocals";
export type Genre = "Rock" | "Pop" | "Metal" | "Jazz" | "R&B";

export interface Post {
  _id: string;
  userId: string; // Clerk ID (clerkUserId)
  userName?: string; // Optional username for easy display
  title: string;
  body: string;
  date?: string | Date;
  tags?: string[]; // Structured: ["skill:amateur", "instrument:guitar", "genre:rock"]
  audioUploadId?: string;
  albumArtUrl?: string;
}

export interface IPost {
  _id: string; // MongoDB ObjectId
  userId: string; // Clerk ID (clerkUserId)
  userName?: string; // Optional username for easy display
  title: string;
  body: string;
  date?: Date;
  tags?: string[];
  audioUploadId?: mongoose.Types.ObjectId;
  albumArtUrl?: string;
}

export interface CreatePostInput {
  userId: string; // Clerk ID (clerkUserId)
  userName?: string; // Optional username
  title: string;
  body: string;
  tags?: string[];
  audioUploadId?: string;
  albumArtUrl?: string;
}

// Helper functions for tag management
export function createTag(type: "skill" | "instrument" | "genre", value: string): string {
  return `${type}:${value}`;
}

export function parseTag(tag: string): { type: "skill" | "instrument" | "genre" | "unknown"; value: string } {
  const [type, ...valueParts] = tag.split(":");
  const value = valueParts.join(":");

  if (type === "skill" || type === "instrument" || type === "genre") {
    return { type, value };
  }
  return { type: "unknown", value: tag };
}

export function getTagsByType(tags: string[] = [], type: "skill" | "instrument" | "genre"): string[] {
  return tags
    .filter(tag => tag.startsWith(`${type}:`))
    .map(tag => tag.split(":").slice(1).join(":"));
}
