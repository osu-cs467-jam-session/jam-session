'use client'

import { useRef } from 'react'
import PostForm from '@/components/PostForm'
import PostList, { type PostListRef } from '@/components/PostList'

export default function NewsFeed() {
  const postListRef = useRef<PostListRef>(null)

  const handlePostCreated = async () => {
    // Refresh the post list
    await postListRef.current?.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">News Feed</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your music, connect with musicians, and discover new collaborations.
        </p>
      </div>

      {/* Post Creation Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
        <PostForm onPostCreated={handlePostCreated} />
      </div>

      {/* Posts List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        <PostList ref={postListRef} />
      </div>
    </div>
  )
}
