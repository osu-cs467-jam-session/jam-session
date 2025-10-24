import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  instrumentsArray: [{ type: String, required: true }],
  preferredGenre: { type: String },
  location: { type: String },
  contact: { type: String }
}, { timestamps: true });

const User = models.User || mongoose.model("User", UserSchema);
export default User;
