'use client'

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import type { Post } from '@/types/post'
import { fetchPosts, type PostFilters as PostFiltersType } from '@/lib/api/client'
import PostCard from './PostCard'
import PostFilters, { type PostFilters as PostFiltersState } from './PostFilters'

type PostListProps = {
  userId?: string // Optional filter by user
}

export type PostListRef = {
  refresh: () => Promise<void>
}

const PostList = forwardRef<PostListRef, PostListProps>(({ userId }, ref) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<PostFiltersType>({})

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchFilters: PostFiltersType = userId ? { userId } : {}
      if (filters.instruments) fetchFilters.instruments = filters.instruments
      if (filters.skill) fetchFilters.skill = filters.skill
      if (filters.genres) fetchFilters.genres = filters.genres
      if (filters.search) fetchFilters.search = filters.search
      
      const fetchedPosts = await fetchPosts(Object.keys(fetchFilters).length > 0 ? fetchFilters : undefined)
      // Sort by date (newest first)
      const sorted = fetchedPosts.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0
        const dateB = b.date ? new Date(b.date).getTime() : 0
        return dateB - dateA
      })
      setPosts(sorted)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    refresh: loadPosts,
  }))

  useEffect(() => {
    loadPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, filters])

  const handleFilter = (newFilters: PostFiltersState) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-4">
      <PostFilters onFilter={handleFilter} />
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-6 bg-background animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="border rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadPosts}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="border rounded-lg p-12 text-center bg-background">
          <p className="text-gray-500 text-lg">No posts found.</p>
          <p className="text-gray-400 text-sm mt-2">
            {Object.keys(filters).length > 0 
              ? "Try adjusting your filters." 
              : "Be the first to share something!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
})

PostList.displayName = 'PostList'

export default PostList

