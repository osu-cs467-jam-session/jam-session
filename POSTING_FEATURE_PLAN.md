# Posting Feature Implementation Plan

## Goal
Complete all posting functionality in small, reviewable PRs. Each PR should be focused and easy to review.

## PR Breakdown

### PR 1: Helper Functions (Foundation)
**Branch**: `feature/helper-functions`
**Files**:
- `src/app/models/helper_functions.ts` (new)

**What it does**:
- Creates `convertStringIdToObjectId()` function
- Used by User model (already exists but missing this dependency)

**Why separate**: Small, foundational utility that other models will use.

---

### PR 2: Post Types Update
**Branch**: `feature/post-types`
**Files**:
- `src/types/post.ts` (update)

**What it does**:
- Updates Post type to match backend structure (title, body, tags, etc.)
- Adds helper functions for tag management
- Adds CreatePostInput type

**Why separate**: Type definitions only, no logic. Easy to review.

---

### PR 3: Post Model Implementation
**Branch**: `feature/post-model`
**Files**:
- `src/app/models/post.ts` (implement)

**What it does**:
- Creates Mongoose schema for Post
- Implements CRUD operations (create, read, update, delete)
- Connects to MongoDB

**Why separate**: Database layer only, no API or UI changes.

---

### PR 4: Posts API Route
**Branch**: `feature/posts-api`
**Files**:
- `src/app/api/posts/posts.ts` (implement)

**What it does**:
- GET endpoint: List all posts (with pagination)
- POST endpoint: Create new post (with Clerk auth)
- Error handling

**Why separate**: API layer only, can be tested independently.

---

### PR 5: PostForm API Integration
**Branch**: `feature/postform-api-integration`
**Files**:
- `src/components/PostForm.tsx` (update)

**What it does**:
- Connects PostForm to Posts API
- Handles API calls in onSubmit
- Error handling and success feedback

**Why separate**: UI integration, completes the posting flow.

---

## Implementation Order

1. ✅ CSS Fix (already done)
2. PR 1: Helper Functions
3. PR 2: Post Types
4. PR 3: Post Model
5. PR 4: Posts API
6. PR 5: PostForm Integration

## Testing Strategy

Each PR should include:
- Manual testing instructions
- Verification that it doesn't break existing functionality
- Clear description of what was added/changed

## Notes

- **DO NOT** touch:
  - Home page (teammate working on it)
  - Profile update/delete (teammate working on it)
  
- **Focus on**:
  - Post creation
  - Post listing (for newsfeed - but don't build newsfeed component)
  - Post data structure


