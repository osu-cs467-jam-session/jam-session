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

