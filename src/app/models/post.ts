import mongoose, { Schema, models } from "mongoose";

const PostSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: [{ type: String }]
}, { timestamps: true });

const Post = models.Post || mongoose.model("Post", PostSchema);
export default Post;
