// Login Component
// To test: run npm dev > http://localhost:3000/login

'use client'

import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";

export default function Home() {
    // NEXT_PUBLIC_ vars are available in client components
    const clerkKey = process.env.NEXT_PUBLIC_CLERK_KEY;
    
    // If no Clerk key, show message (build will still work)
    if (!clerkKey) {
        return (
            <div className="p-4">
                <p className="text-gray-600">Need help configuring clerk key. Please set NEXT_PUBLIC_CLERK_KEY environment variable.</p>
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