import mongoose, { Schema, Document, model } from "mongoose";

export interface IProfile extends Document {
  clerkUserId: string;
  username: string;
  instrumentsArray?: string[];
  location?: string;
  preferredGenre?: string;
  contact?: string;
}

const ProfileSchema = new Schema<IProfile>({
  clerkUserId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  instrumentsArray: { type: [String], default: [] },
  location: String,
  preferredGenre: String,
  contact: String,
});

export default mongoose.models.Profile ||
  model<IProfile>("Profile", ProfileSchema);
