'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import type { CreatePostInput, SkillLevel, Instrument, Genre } from '@/types/post'
import { createTag } from '@/types/post'
import { createPost } from '@/lib/api/client'
import styles from './PostForm.module.css'

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
  placeholder = 'Post your audio here and let others know what you are looking for!',
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
      await onSubmit?.({ text: text.trim() })
      setText('') // clear text field
    } catch (err) {
      console.log('Post submission error:', err)
      setError('Failed to submit') // error message of failed submission
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show login prompt if not authenticated
  if (isLoaded && !user) {
    return (
      <div className={styles.form}>
        <p className="text-center text-gray-500">Please sign in to create a post.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="post-text" className="sr-only">Create post</label>
      <textarea
        id="post-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        className={styles.textarea}
        aria-invalid={!isValid}
        aria-describedby="post-help post-error"
      />
      <div className={styles.footer}>
        <span
          id="post-help"
          className={remaining < 0 ? styles.counterError : styles.counter}
        >
          {remaining} characters left
        </span>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={styles.button}
        >
          {isSubmitting ? 'Posting…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
