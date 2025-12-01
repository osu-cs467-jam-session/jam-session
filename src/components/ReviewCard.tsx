'use client'

import { useUser } from '@clerk/nextjs'
import type { Review } from '@/types/review'

type ReviewCardProps = {
  review: Review
  onEdit?: (review: Review) => void
  onDelete?: (reviewId: string) => void
}

export default function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const { user } = useUser()
  const isOwner = user?.id === review.reviewerClerkUserId

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ))
  }

  return (
    <div className="border rounded-lg p-4 bg-background">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">
              {review.reviewerUserName || review.reviewerClerkUserId}
            </span>
            <div className="flex items-center gap-1 text-sm">
              {renderStars(review.rating)}
            </div>
          </div>
          <time className="text-xs text-gray-500">
            {formatDate(review.date)}
          </time>
        </div>
        {isOwner && (onEdit || onDelete) && (
          <div className="flex gap-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(review._id)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
      {review.comment && (
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          {review.comment}
        </p>
      )}
    </div>
  )
}

