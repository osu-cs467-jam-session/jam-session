/**
 * Adapted Tailwind utilities for styling the post detail page from ChatGPT 5.1 on 11/17/2025.
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { fetchPostById, deletePost } from '@/lib/api/client'
import { useUser } from '@clerk/nextjs'
import type { Post } from '@/types/post'
import { getTagsByType } from '@/types/post'
import Link from 'next/link'
import Image from 'next/image'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const postId = params.id as string

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedPost = await fetchPostById(postId)
        setPost(fetchedPost)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      loadPost()
    }
  }, [postId])

  const handleDelete = async () => {
    if (!post || !confirm('Are you sure you want to delete this post?')) return

    try {
      setIsDeleting(true)
      await deletePost(post._id)
      router.push('/')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isOwner = user && post && user.id === post.userId

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="border rounded-lg p-8 bg-background animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="border rounded-lg p-8 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Post not found'}
          </p>
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            ← Back to News Feed
          </Link>
        </div>
      </div>
    )
  }

  const skillTags = getTagsByType(post.tags, "skill")
  const instrumentTags = getTagsByType(post.tags, "instrument")
  const genreTags = getTagsByType(post.tags, "genre")

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:underline"
      >
        ← Back to News Feed
      </Link>

      {/* Post Content */}
      <article className="border rounded-lg p-8 bg-background">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>By {post.userId}</span>
              <span>•</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          </div>
          {post.albumArtUrl && (
            <div className="ml-6 flex-shrink-0">
              <Image
                src={post.albumArtUrl}
                alt="Album art"
                width={120}
                height={120}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* Tags */}
        {(skillTags.length > 0 || instrumentTags.length > 0 || genreTags.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {skillTags.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                Skill: {skill}
              </span>
            ))}
            {instrumentTags.map(instrument => (
              <span
                key={instrument}
                className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 capitalize"
              >
                {instrument}
              </span>
            ))}
            {genreTags.map(genre => (
              <span
                key={genre}
                className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 capitalize"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="prose dark:prose-invert max-w-none mb-6">
          <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {post.body}
          </p>
        </div>

        {/* Audio Indicator */}
        {post.audioUploadId && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200">
              🎵 Audio file attached (Audio player coming soon)
            </p>
          </div>
        )}

        {/* Actions (if owner) */}
        {isOwner && (
          <div className="pt-6 border-t flex gap-4">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>
        )}

        {/* Comments Section (Placeholder) */}
        <div className="pt-6 border-t mt-6">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <p className="text-gray-500 text-sm">Comments feature coming soon...</p>
        </div>
      </article>
    </div>
  )
}

