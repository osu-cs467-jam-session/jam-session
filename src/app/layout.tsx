import type { Metadata } from "next";

// Google fonts
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

// Clerk (authentication service)
import { ClerkProvider } from "@clerk/nextjs";

// theme management
import { ThemeProvider } from "@/components/ui/ThemeProvider";

// custom NavBar/Project Name component
import NavBar from "@/components/ui/NavBar";

// ***************************************************************

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jam Session",   // should this be named something else?
  description: "",        // should a desciption be added?
};

// main layout wrapper
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // wrap in ClerkProvider to provide authentication context to all child components
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* wrap in ThemeProvider for theme management */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <div className="min-h-screen">
              {/* navigation bar at top of app */}
              <NavBar />
              <main className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* commenting this line out for now
                    <div className="hidden lg:block lg:col-span-3">Sidebar</div>
                    */}
                    <div className="lg:col-span-9">{children}</div>
                  </div>
                </div>
              </main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
