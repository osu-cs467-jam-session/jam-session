import mongoose from "mongoose";

export interface IProfile {
  clerkUserId: string; // link to Clerk user (required)
  username?: string; // optional display username
  instrumentsArray?: string[];
  preferredGenre?: string;
  location?: string;
  contact?: string;
}

const ProfileSchema = new mongoose.Schema<IProfile>(
  {
    clerkUserId: { type: String, required: true, unique: true }, // required link
    username: { type: String },
    instrumentsArray: { type: [String], default: [] },
    preferredGenre: { type: String },
    location: { type: String },
    contact: { type: String },
  },
  { timestamps: true }
);

// prevent model overwrite on hot reload
const Profile =
  mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);

export default Profile;
