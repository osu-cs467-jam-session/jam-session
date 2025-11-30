export interface Review {
  _id: string;
  postId: string;
  reviewerClerkUserId: string;
  reviewerUserName?: string;
  rating: number;
  comment?: string;
  date?: string | Date;
}

export interface CreateReviewInput {
  reviewerClerkUserId: string;
  reviewerUserName?: string;
  postId: string;
  rating: number;
  comment?: string;
}

