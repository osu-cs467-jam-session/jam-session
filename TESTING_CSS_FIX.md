# Testing CSS Fix - Step by Step Instructions

## Step 1: Install Dependencies (if needed)
```powershell
npm install
```
This ensures all packages (including @clerk/nextjs) are installed.

## Step 2: Check Current Status
```powershell
git status
```
You should see `PostForm.module.css` as modified.

## Step 3: Test the Build Locally
```powershell
npm run build
```
This will:
- Compile your Next.js app
- Process CSS files with Tailwind
- Show any build errors

**Expected Result**: Build should succeed without CSS errors about `max-w-2xl` or `@apply`.

## Step 4: If Build Succeeds, Test Dev Server
```powershell
npm run dev
```
Then open http://localhost:3000 in your browser to visually verify the PostForm component.

## Step 5: Commit and Push (if build passes)
```powershell
git add src/components/PostForm.module.css
git commit -m "fix: Add @reference directive for Tailwind v4 CSS modules compatibility"
git push origin feature_postform
```

## Troubleshooting
If build fails:
- Check error message - it should tell you which utility class is unknown
- Verify `@reference "tailwindcss";` is at the top of PostForm.module.css
- Make sure you're using Tailwind CSS v4 (check package.json)

