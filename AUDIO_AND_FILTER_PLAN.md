# Audio Upload & Filter/Search Implementation Plan

## Goal
Complete audio upload functionality for posts and implement filter/search system for the news feed. Each PR should be focused and easy to review.

## PR Breakdown

---

## Part 1: Audio Upload Functionality

### PR 1: File Upload API Endpoint
**Branch**: `feature/audio-upload-api`
**Files**:
- `src/app/api/audio_uploads/upload/route.ts` (new)

**What it does**:
- Creates POST endpoint to handle multipart/form-data file uploads
- Validates file type (audio only: mp3, wav, m4a, etc.)
- Validates file size (e.g., max 10MB)
- Saves file to `public/uploads/audio/` directory
- Returns file path and metadata

**Why separate**: Core file handling logic, can be tested independently.

**Testing**:
- Test with valid audio files
- Test with invalid file types
- Test with oversized files
- Verify files are saved correctly

---

### PR 2: Update Audio Upload Model
**Branch**: `feature/audio-upload-model-update`
**Files**:
- `src/app/models/audio_upload.ts` (update)
- `src/app/api/audio_uploads/route.ts` (update)

**What it does**:
- Updates `IAudioUpload` to include `filePath` field (where file is stored)
- Updates `createAudioUpload` to accept filePath
- Updates POST endpoint to handle file uploads via new upload endpoint
- Adds helper function to get audio file URL

**Why separate**: Database schema changes, no UI changes yet.

**Testing**:
- Verify model accepts filePath
- Test creating audio upload with filePath

---

### PR 3: Audio Upload Client Utilities
**Branch**: `feature/audio-upload-client`
**Files**:
- `src/lib/api/client.ts` (update)

**What it does**:
- Adds `uploadAudioFile(file: File, userId: string)` function
- Handles FormData creation and file upload
- Returns audio upload metadata including filePath
- Adds error handling for upload failures

**Why separate**: Client-side API integration, no UI changes yet.

**Testing**:
- Test uploading audio file from client
- Test error handling

---

### PR 4: Audio Player Component
**Branch**: `feature/audio-player-component`
**Files**:
- `src/components/AudioPlayer.tsx` (new)
- `src/components/AudioPlayer.module.css` (new, optional)

**What it does**:
- Creates reusable audio player component
- Uses HTML5 `<audio>` element
- Shows play/pause controls
- Shows progress bar and time remaining
- Handles loading states

**Why separate**: Reusable UI component, can be tested in isolation.

**Testing**:
- Test play/pause functionality
- Test with different audio formats
- Test loading states

---

### PR 5: Update PostForm for Audio Upload
**Branch**: `feature/postform-audio-upload`
**Files**:
- `src/components/PostForm.tsx` (update)

**What it does**:
- Adds file input for audio upload
- Shows selected file name
- Uploads audio file before creating post
- Links audioUploadId to post
- Shows upload progress
- Handles upload errors

**Why separate**: UI integration, completes audio upload flow.

**Testing**:
- Test selecting and uploading audio file
- Test creating post with audio
- Test error handling
- Verify audio is linked to post

---

### PR 6: Display Audio in PostCard and PostDetail
**Branch**: `feature/display-audio-in-posts`
**Files**:
- `src/components/PostCard.tsx` (update)
- `src/app/posts/[id]/page.tsx` (update)
- `src/lib/api/client.ts` (update - add fetchAudioUpload)

**What it does**:
- Fetches audio upload data when post has audioUploadId
- Displays AudioPlayer component in PostCard (preview)
- Displays AudioPlayer component in PostDetail (full player)
- Handles loading states for audio

**Why separate**: Display logic, completes audio feature.

**Testing**:
- Test posts with audio display correctly
- Test posts without audio still work
- Test audio playback in both locations

---

## Part 2: Filter & Search Functionality

### PR 7: Posts API Filter Support
**Branch**: `feature/posts-api-filters`
**Files**:
- `src/app/api/posts/route.ts` (update)
- `src/app/models/post.ts` (update - add filter helper functions)

**What it does**:
- Updates GET endpoint to accept query parameters:
  - `instrument` - filter by instrument tag
  - `skill` - filter by skill level tag
  - `genre` - filter by genre tag
  - `search` - text search in title and body
- Implements filtering logic using tag matching
- Implements text search using MongoDB text search or regex

**Why separate**: Backend filtering logic, no UI changes.

**Testing**:
- Test filtering by instrument
- Test filtering by skill level
- Test filtering by genre
- Test text search
- Test multiple filters combined
- Test with no results

---

### PR 8: Filter Types and Client API
**Branch**: `feature/filter-types-api-client`
**Files**:
- `src/types/post.ts` (update)
- `src/lib/api/client.ts` (update)

**What it does**:
- Adds `PostFilters` type for filter parameters
- Updates `fetchPosts` to accept optional filters
- Adds helper functions for building filter queries

**Why separate**: Type definitions and API client, no UI yet.

**Testing**:
- Test fetchPosts with various filter combinations
- Test filter query building

---

### PR 9: Filter UI Component
**Branch**: `feature/filter-ui-component`
**Files**:
- `src/components/PostFilters.tsx` (new)
- `src/components/PostFilters.module.css` (new, optional)

**What it does**:
- Creates filter component with:
  - Instrument checkboxes/multi-select
  - Skill level dropdown/buttons
  - Genre checkboxes/multi-select
  - Search input field
  - Clear filters button
- Shows active filter count
- Handles filter state

**Why separate**: Reusable filter UI, can be tested independently.

**Testing**:
- Test selecting filters
- Test clearing filters
- Test filter state persistence

---

### PR 10: Integrate Filters with NewsFeed
**Branch**: `feature/integrate-filters-newsfeed`
**Files**:
- `src/app/newsfeed/newsfeed.tsx` (update)
- `src/components/PostList.tsx` (update)

**What it does**:
- Adds PostFilters component to NewsFeed
- Updates PostList to accept and use filters
- Refreshes posts when filters change
- Shows "No results" message when filters return empty
- Maintains filter state in URL query params (optional)

**Why separate**: Integration layer, completes filter feature.

**Testing**:
- Test filtering posts in newsfeed
- Test clearing filters
- Test search functionality
- Test multiple filters together
- Test with no results

---

## Implementation Order

### Audio Upload:
1. PR 1: File Upload API Endpoint
2. PR 2: Update Audio Upload Model
3. PR 3: Audio Upload Client Utilities
4. PR 4: Audio Player Component
5. PR 5: Update PostForm for Audio Upload
6. PR 6: Display Audio in PostCard and PostDetail

### Filter & Search:
7. PR 7: Posts API Filter Support
8. PR 8: Filter Types and Client API
9. PR 9: Filter UI Component
10. PR 10: Integrate Filters with NewsFeed

## Testing Strategy

Each PR should include:
- Manual testing instructions
- Verification that it doesn't break existing functionality
- Clear description of what was added/changed
- Edge cases considered (empty results, errors, etc.)

## Notes

- **DO NOT** touch:
  - Home page structure (teammate working on it)
  - User profile pages (teammate working on it)
  - Authentication logic (teammates handling it)
  
- **Focus on**:
  - Audio file upload and storage
  - Audio playback in posts
  - Filtering posts by tags
  - Searching posts by text

- **File Storage**:
  - For now, use local filesystem (`public/uploads/audio/`)
  - Can be migrated to cloud storage (S3, Cloudinary) later
  - Ensure `.gitignore` excludes uploaded files

- **Audio Formats**:
  - Support common formats: mp3, wav, m4a, ogg
  - Validate file type on upload
  - Consider file size limits (10MB recommended)

- **Filter Performance**:
  - Consider pagination for large result sets
  - May need database indexes on tags for performance
  - Text search may need full-text index


