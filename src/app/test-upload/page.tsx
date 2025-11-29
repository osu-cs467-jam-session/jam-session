'use client'

/**
 * Test Upload Page
 * 
 * PR 1: Temporary test page for audio file upload functionality
 * Branch: feature/audio-upload-api
 * 
 * This page allows testing the audio upload API endpoint.
 * Navigate to /test-upload to test file uploads.
 * 
 * Testing:
 * 1. Sign in to the application
 * 2. Navigate to /test-upload
 * 3. Select an audio file from your computer
 * 4. Click "Upload File"
 * 5. Verify upload success and test audio playback
 * 
 * Note: This is a temporary page and will be removed after PR 5
 * when audio upload is integrated into PostForm.
 */

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
export default function TestUploadPage() {
  const { user, isLoaded } = useUser()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{
    filename: string;
    originalName: string;
    filePath: string;
    size: number;
    type: string;
    uploadedAt?: string;
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file || !user) {
      setError('Please select a file and make sure you are signed in')
      return
    }

    setUploading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id) // Using Clerk ID

      const response = await fetch('/api/audio_uploads/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      setResult(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (!isLoaded) {
    return <div className="p-8">Loading...</div>
  }

  if (!user) {
    return (
      <div className="p-8">
        <p className="text-red-600">Please sign in to test file upload</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Audio Upload Test Page</h1>
      <p className="text-gray-600 dark:text-gray-400">
        This is a temporary test page. The full upload UI will be in PostForm (PR 5).
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="audio-file" className="block text-sm font-medium mb-2">
            Select Audio File
          </label>
          <input
            id="audio-file"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            disabled={uploading}
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded">
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded space-y-2">
            <p className="text-green-800 dark:text-green-200 font-semibold">Upload Successful!</p>
            <div className="text-sm space-y-1">
              <p><strong>Filename:</strong> {result.filename}</p>
              <p><strong>Original Name:</strong> {result.originalName}</p>
              <p><strong>File Path:</strong> {result.filePath}</p>
              <p><strong>Size:</strong> {(result.size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>Type:</strong> {result.type}</p>
            </div>
            {result.filePath && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Test Audio Player:</p>
                <audio controls src={result.filePath} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

