// Login Component
// To test: run npm dev > http://localhost:3000/login

'use client'

import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";

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