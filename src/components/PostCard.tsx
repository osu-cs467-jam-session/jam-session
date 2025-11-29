'use client'

import Link from 'next/link'
import type { Post } from '@/types/post'
import { getTagsByType } from '@/types/post'
import Image from 'next/image'

type PostCardProps = {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const skillTags = getTagsByType(post.tags, "skill")
  const instrumentTags = getTagsByType(post.tags, "instrument")
  const genreTags = getTagsByType(post.tags, "genre")

  const formatDate = (date?: string | Date) => {
    if (!date) return 'Unknown date'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'Unknown date'
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDateString = (date?: string | Date): string | undefined => {
    if (!date) return undefined
    if (typeof date === 'string') return date
    return date.toISOString()
  }

  // Truncate body for preview
  const preview = post.body && post.body.length > 200 
    ? post.body.substring(0, 200) + '...' 
    : post.body || ''

  return (
    <Link href={`/posts/${post._id}`} className="block">
      <article className="border rounded-lg p-6 bg-background hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>By {post.userName || post.userId}</span>
              <span>•</span>
              <time dateTime={getDateString(post.date)}>{formatDate(post.date)}</time>
            </div>
          </div>
          {post.albumArtUrl && (
            <div className="ml-4 flex-shrink-0">
              <Image
                src={post.albumArtUrl}
                alt="Album art"
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* Body Preview */}
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {preview}
        </p>

        {/* Tags */}
        {(skillTags.length > 0 || instrumentTags.length > 0 || genreTags.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {skillTags.map(skill => (
              <span
                key={skill}
                className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                Skill: {skill}
              </span>
            ))}
            {instrumentTags.map(instrument => (
              <span
                key={instrument}
                className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 capitalize"
              >
                {instrument}
              </span>
            ))}
            {genreTags.map(genre => (
              <span
                key={genre}
                className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 capitalize"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="hover:text-blue-600">Read more →</span>
          {post.audioUploadId && (
            <span className="flex items-center gap-1">
              🎵 Audio attached
            </span>
          )}
        </div>
      </article>
    </Link>
  )
}

