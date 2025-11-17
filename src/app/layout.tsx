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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* Body contains all visible content */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap with ClerkProvider to handle authentication context */}
        <ClerkProvider>
          {/* Wrap with ThemeProvider for dark/light mode management */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen">
              {/* navigation bar at top of app */}
              <NavBar />
              <main className="py-8">
                <div className="lg:col-span-9">{children}</div>
              </main>
            </div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
