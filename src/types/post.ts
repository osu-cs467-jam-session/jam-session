export type PostId = string;

export type Post = {
  id: PostId;
  text: string;
  authorId?: string; // optional until auth is setup
  createdAt: string; // Serialized date
};

export type NewPostInput = {
  text: string;
};

export interface IPost {
  _id: string; // MongoDB ObjectId
  userId: string; // Reference to User's ObjectId
  userName: string;
  title: string;
  body: string;
  date?: Date;
  tags?: string[];
}

