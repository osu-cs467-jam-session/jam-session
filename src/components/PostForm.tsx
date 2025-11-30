'use client'

import { useState } from 'react'
import type { NewPostInput } from '../types/post'
import styles from './PostForm.module.css'

type PostFormProps = {
  onSubmit?: (input: NewPostInput) => Promise<void> | void
  maxLength?: number // Character limit
  placeholder?: string // Hint for the user
  submitLabel?: string // Button text
}

export default function PostForm({
  onSubmit,
  maxLength = 500,
  placeholder = 'Post your audio here and let others know what you are looking for!',
  submitLabel = 'Post',
}: PostFormProps) {
  const [text, setText] = useState('') // Content of the post
  const [isSubmitting, setIsSubmitting] = useState(false) // Loading state while submitting
  const [error, setError] = useState<string | null>(null) // Error message from failed submission

  const remaining = maxLength - text.length // how many characters are left
  const isValid = text.trim().length > 0 && text.length <= maxLength // validation check

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid || isSubmitting) return //prevention of dupes or empty posts
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
      {error && (
        <p id="post-error" className={styles.error}>{error}</p>
      )}
    </form>
  )
}


