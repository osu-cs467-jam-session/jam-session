import type { Post, CreatePostInput } from "@/types/post";
import type { Review, CreateReviewInput } from "@/types/review";

const API_BASE = "/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// generic fetch wrapper
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || `API request failed: ${response.statusText}`);
  }

  if (!data.data) {
    throw new Error("No data returned from API");
  }

  return data.data;
}

// posts API
export async function fetchPosts(filters?: {
  userId?: string;
  id?: string;
}): Promise<Post[]> {
  const params = new URLSearchParams();
  if (filters?.userId) params.append("userId", filters.userId);
  if (filters?.id) params.append("id", filters.id);

  const query = params.toString();
  return apiRequest<Post[]>(`/posts${query ? `?${query}` : ""}`);
}

export async function fetchPostById(id: string): Promise<Post> {
  const posts = await fetchPosts({ id });
  if (posts.length === 0) {
    throw new Error("Post not found");
  }
  return posts[0];
}

export async function createPost(postData: CreatePostInput): Promise<Post> {
  return apiRequest<Post>("/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
}

export async function updatePost(
  id: string,
  updates: Partial<CreatePostInput>
): Promise<Post> {
  return apiRequest<Post>("/posts", {
    method: "PUT",
    body: JSON.stringify({ _id: id, ...updates }),
  });
}

export async function deletePost(id: string): Promise<Post> {
  return apiRequest<Post>(`/posts?id=${id}`, {
    method: "DELETE",
  });
}

// reviews API
export async function fetchReviews(filters?: {
  id?: string;
  postId?: string;
}): Promise<Review[]> {
  const params = new URLSearchParams();
  if (filters?.id) params.append("id", filters.id);
  if (filters?.postId) params.append("postId", filters.postId);

  const query = params.toString();
  return apiRequest<Review[]>(`/reviews${query ? `?${query}` : ""}`);
}

export async function fetchReviewById(id: string): Promise<Review> {
  const reviews = await fetchReviews({ id });
  if (reviews.length === 0) {
    throw new Error("Review not found");
  }
  return reviews[0];
}

export async function fetchReviewsByPostId(postId: string): Promise<Review[]> {
  return fetchReviews({ postId });
}

export async function createReview(reviewData: CreateReviewInput): Promise<Review> {
  return apiRequest<Review>("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}

export async function updateReview(
  id: string,
  updates: Partial<CreateReviewInput>
): Promise<Review> {
  return apiRequest<Review>("/reviews", {
    method: "PUT",
    body: JSON.stringify({ _id: id, ...updates }),
  });
}

export async function deleteReview(id: string, userId: string): Promise<Review> {
  return apiRequest<Review>(`/reviews?id=${id}&userId=${userId}`, {
    method: "DELETE",
  });
}

