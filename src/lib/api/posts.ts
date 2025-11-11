import type { Post } from "@/types/post";

function generateId(): string {
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Template API client for creating a post when backend is ready. 
 */
export async function createPost(text: string): Promise<Post> {
	await new Promise((r) => setTimeout(r, 200));

	return {
		id: generateId(),
		text,
		createdAt: new Date().toISOString(),
	};
}


