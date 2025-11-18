// Frontend types matching backend IPost interface

export type SkillLevel = "Amateur" | "Advanced Amateur" | "Proficient" | "Intermediate" | "Professional";
export type Instrument = "Drums" | "Bass" | "Guitar" | "Piano" | "Vocals";
export type Genre = "Rock" | "Pop" | "Metal" | "Jazz" | "R&B";

export interface Post {
  _id: string;
  userId: string; // Can be Clerk ID or MongoDB ObjectId
  title: string;
  body: string;
  date?: string;
  tags?: string[]; // Structured: ["skill:amateur", "instrument:guitar", "genre:rock"]
  audioUploadId?: string;
  albumArtUrl?: string;
}

export interface CreatePostInput {
  userId: string; // Clerk ID
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
