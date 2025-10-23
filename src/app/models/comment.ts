import mongoose, { Schema, models } from "mongoose";

const CommentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, required: true }
}, { timestamps: true });

const Comment = models.Comment || mongoose.model("Comment", CommentSchema);
export default Comment;
