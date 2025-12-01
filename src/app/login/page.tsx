"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

/*
 * Login page for the app
 * - Shows a sign-in button if the user is not signed in
 * - Shows a user menu button if the user is signed in
 * - Checks that the Clerk publishable key is set and provides a message if not
 */

export default function Home() {
  // NEXT_PUBLIC_ vars are available in client components
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If no Clerk key, show message (build will still work)
  if (!clerkKey) {
    return (
      <div className="p-4">
        <p className="text-gray-600">
          Need help configuring Clerk. Please set
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable.
        </p>
      </div>
    );
  }

  return (
    <div>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-blue-700">Sign In</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
