'use client'

import { useState } from 'react'
import type { Instrument, Genre, SkillLevel } from '@/types/post'

const SKILL_LEVELS: SkillLevel[] = ["Amateur", "Advanced Amateur", "Proficient", "Intermediate", "Professional"]
const INSTRUMENTS: Instrument[] = ["Drums", "Bass", "Guitar", "Piano", "Vocals"]
const GENRES: Genre[] = ["Rock", "Pop", "Metal", "Jazz", "R&B"]

export interface PostFilters {
  instruments?: Instrument[]
  skill?: SkillLevel
  genres?: Genre[]
  search?: string
}

type PostFiltersProps = {
  onFilter: (filters: PostFilters) => void
}

export default function PostFilters({ onFilter }: PostFiltersProps) {
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([])
  const [selectedSkill, setSelectedSkill] = useState<SkillLevel | ''>('')
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [searchText, setSearchText] = useState('')

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const filters: PostFilters = {}
    if (selectedInstruments.length > 0) filters.instruments = selectedInstruments
    if (selectedSkill) filters.skill = selectedSkill
    if (selectedGenres.length > 0) filters.genres = selectedGenres
    if (searchText.trim()) filters.search = searchText.trim()
    onFilter(filters)
  }

  const handleClear = () => {
    setSelectedInstruments([])
    setSelectedSkill('')
    setSelectedGenres([])
    setSearchText('')
    onFilter({})
  }

  const hasFilters = selectedInstruments.length > 0 || selectedSkill || selectedGenres.length > 0 || searchText.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="w-full p-4 border rounded-lg shadow-sm bg-background mb-4">
      <div className="space-y-4">
        {/* Search Input */}
        <div>
          <label htmlFor="filter-search" className="block text-sm font-medium mb-1">
            Search
          </label>
          <input
            id="filter-search"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search in title or content..."
            className="w-full rounded-md border p-2 outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
          />
        </div>

        {/* Skill Level */}
        <div>
          <label className="block text-sm font-medium mb-2">Skill Level</label>
          <div className="flex flex-wrap gap-2">
            {SKILL_LEVELS.map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedSkill(level === selectedSkill ? '' : level)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedSkill === level
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
          <label className="block text-sm font-medium mb-2">Instruments</label>
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
          <label className="block text-sm font-medium mb-2">Genres</label>
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

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          {hasFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </form>
  )
}

