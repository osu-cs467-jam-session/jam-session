'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import type { CreateReviewInput } from '@/types/review'
import { createReview, updateReview } from '@/lib/api/client'

type ReviewFormProps = {
  postId: string
  onReviewCreated?: () => void
  onReviewUpdated?: () => void
  onCancel?: () => void
  existingReview?: { _id: string; rating: number; comment?: string }
}

export default function ReviewForm({
  postId,
  onReviewCreated,
  onReviewUpdated,
  onCancel,
  existingReview,
}: ReviewFormProps) {
  const { user, isLoaded } = useUser()
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid = rating >= 1 && rating <= 5

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating)
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      const filled = starValue <= rating
      return (
        <button
          key={i}
          type="button"
          onClick={() => handleStarClick(starValue)}
          className={`text-2xl ${filled ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-yellow-300'}`}
        >
          ★
        </button>
      )
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid || isSubmitting || !user) return

    setIsSubmitting(true)
    setError(null)

    try {
      if (existingReview) {
        await updateReview(existingReview._id, {
          reviewerClerkUserId: user.id,
          rating,
          comment: comment.trim() || undefined,
        })
        onReviewUpdated?.()
      } else {
        const reviewData: CreateReviewInput = {
          reviewerClerkUserId: user.id,
          postId,
          rating,
          comment: comment.trim() || undefined,
        }
        await createReview(reviewData)
        setRating(0)
        setComment('')
        onReviewCreated?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoaded && !user) {
    return (
      <div className="w-full p-4 border rounded-lg bg-background">
        <p className="text-center text-gray-500">Please sign in to leave a review.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 border rounded-lg bg-background">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Rating {existingReview ? '(click to change)' : ''}
          </label>
          <div className="flex items-center gap-2">
            {renderStars()}
            {rating > 0 && (
              <span className="text-sm text-gray-500 ml-2">
                {rating}/5
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="review-comment" className="block text-sm font-medium mb-1">
            Comment (Optional)
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full resize-y rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          {existingReview && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : existingReview ? 'Update' : 'Submit'}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </form>
  )
}

