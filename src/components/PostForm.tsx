'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import type { CreatePostInput, SkillLevel, Instrument, Genre } from '@/types/post'
import { createTag } from '@/types/post'
import { createPost } from '@/lib/api/client'

type PostFormProps = {
  onPostCreated?: () => void // Callback after successful post creation
  maxLength?: number
  placeholder?: string
  submitLabel?: string
}

const SKILL_LEVELS: SkillLevel[] = ["Amateur", "Advanced Amateur", "Proficient", "Intermediate", "Professional"]
const INSTRUMENTS: Instrument[] = ["Drums", "Bass", "Guitar", "Piano", "Vocals"]
const GENRES: Genre[] = ["Rock", "Pop", "Metal", "Jazz", "R&B"]

export default function PostForm({
  onPostCreated,
  maxLength = 2000,
  placeholder = 'Share what you are looking for in a jam session!',
  submitLabel = 'Post',
}: PostFormProps) {
  const { user, isLoaded } = useUser()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [skillLevel, setSkillLevel] = useState<SkillLevel | ''>('')
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([])
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [albumArtUrl, setAlbumArtUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remaining = maxLength - body.length
  const isValid = title.trim().length > 0 && body.trim().length > 0 && body.length <= maxLength

  const toggleInstrument = (instrument: Instrument) => {
    setSelectedInstruments(prev =>
      prev.includes(instrument)
        ? prev.filter(i => i !== instrument)
        : [...prev, instrument]
    )
  }

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid || isSubmitting || !user) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Build tags array
      const tags: string[] = []
      if (skillLevel) tags.push(createTag("skill", skillLevel))
      selectedInstruments.forEach(inst => tags.push(createTag("instrument", inst)))
      selectedGenres.forEach(genre => tags.push(createTag("genre", genre)))

      const postData: CreatePostInput = {
        userId: user.id, // Clerk user ID
        title: title.trim(),
        body: body.trim(),
        tags,
        albumArtUrl: albumArtUrl.trim() || undefined,
      }

      await createPost(postData)

      // Reset form
      setTitle('')
      setBody('')
      setSkillLevel('')
      setSelectedInstruments([])
      setSelectedGenres([])
      setAlbumArtUrl('')

      // Notify parent component
      onPostCreated?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show login prompt if not authenticated
  if (isLoaded && !user) {
    return (
      <div className="w-full max-w-2xl p-6 border rounded-lg shadow-sm bg-background">
        <p className="text-center text-gray-500">Please sign in to create a post.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl p-6 border rounded-lg shadow-sm bg-background">
      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="post-title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your post a title..."
            className="w-full rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
            required
            maxLength={100}
          />
        </div>

        {/* Body Textarea */}
        <div>
          <label htmlFor="post-body" className="block text-sm font-medium mb-1">
            Content
          </label>
          <textarea
            id="post-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={6}
            className="w-full resize-y rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
            aria-invalid={!isValid}
            aria-describedby="post-help post-error"
            required
          />
          <div className="mt-1 text-xs text-gray-500">
            {remaining} characters remaining
          </div>
        </div>

        {/* Tag Selection */}
        <div className="space-y-3">
          {/* Skill Level */}
          <div>
            <label className="block text-sm font-medium mb-2">Skill Level (Optional)</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_LEVELS.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSkillLevel(level === skillLevel ? '' : level)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    skillLevel === level
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-transparent border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Instruments */}
          <div>
            <label className="block text-sm font-medium mb-2">Instruments (Optional)</label>
            <div className="flex flex-wrap gap-2">
              {INSTRUMENTS.map(instrument => (
                <button
                  key={instrument}
                  type="button"
                  onClick={() => toggleInstrument(instrument)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors capitalize ${
                    selectedInstruments.includes(instrument)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-transparent border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {instrument}
                </button>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium mb-2">Genres (Optional)</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(genre => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors capitalize ${
                    selectedGenres.includes(genre)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-transparent border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Album Art URL */}
        <div>
          <label htmlFor="album-art" className="block text-sm font-medium mb-1">
            Album Art URL (Optional)
          </label>
          <input
            id="album-art"
            type="url"
            value={albumArtUrl}
            onChange={(e) => setAlbumArtUrl(e.target.value)}
            placeholder="https://example.com/album-art.jpg"
            className="w-full rounded-md border p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting…' : submitLabel}
          </button>
        </div>

        {error && (
          <p id="post-error" className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </form>
  )
}


