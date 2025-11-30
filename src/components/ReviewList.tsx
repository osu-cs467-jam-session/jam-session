'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import type { Review } from '@/types/review'
import { fetchReviewsByPostId, deleteReview } from '@/lib/api/client'
import ReviewCard from './ReviewCard'

type ReviewListProps = {
  postId: string
  onReviewEdit?: (review: Review) => void
}

export default function ReviewList({ postId, onReviewEdit }: ReviewListProps) {
  const { user } = useUser()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReviews = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedReviews = await fetchReviewsByPostId(postId)
      setReviews(fetchedReviews)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [postId])

  const getAverage = () => {
    if (reviews.length === 0) return '0'
    const total = reviews.reduce((sum, r) => sum + r.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ))
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete this review?')) return
    if (!user) return
    
    try {
      await deleteReview(reviewId, user.id)
      loadReviews()
    } catch (err) {
      console.error('Failed to delete review:', err)
    }
  }

  const avg = getAverage()
  const rounded = Math.round(parseFloat(avg))

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="border rounded-lg p-4 bg-background animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={loadReviews}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.length > 0 && (
        <div className="border-b pb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(rounded)}
              </div>
              <span className="text-lg font-semibold">{avg}</span>
              <span className="text-sm text-gray-500">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="border rounded-lg p-8 text-center bg-background">
          <p className="text-gray-500">No reviews yet.</p>
          <p className="text-gray-400 text-sm mt-2">Be the first to leave a review!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <ReviewCard 
              key={review._id} 
              review={review}
              onEdit={onReviewEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

