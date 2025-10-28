// Login Component
// To test: npm run dev > http://localhost:3000/login

'use client'

import { Button } from "@/components/ui/button";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";

export default function Home() {
    return (
        <div>
            <h1>Home Page</h1>
        </div>
    );
}