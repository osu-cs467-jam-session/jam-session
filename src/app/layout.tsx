import type { Metadata } from "next";

// Google fonts
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

// Clerk authentication
import { ClerkProvider } from "@clerk/nextjs";

// Theme management
import { ThemeProvider } from "@/components/ui/ThemeProvider";

// Navigation bar
import NavBar from "@/components/ui/NavBar";

// ***************************************************************

// Configure Google fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Page metadata
export const metadata: Metadata = {
  title: "Jam Session", // App title
  description: "Find and connect with local musicians", // optional description
};

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  const content = (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen">
            <NavBar />
            <main className="py-8">
              <div className="">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );

  // wrap with ClerkProvider if key is available
  if (clerkPublishableKey) {
    return (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        {content}
      </ClerkProvider>
    );
  }

  // fallback for build time when env vars might not be set
  return content;
}
