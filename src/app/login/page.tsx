// Login Component
'use client'

import { SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";

export default function Home() {
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