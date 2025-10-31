// Next.js
import Link from "next/link"; // used for navigation linking

// Clerk (authentication service)
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";

// Icons from React library
import { BellIcon, HomeIcon, UserIcon } from "lucide-react";

// Custom Button component
import { Button } from "@/components/ui/button";

// ***************************************************************

// Define component for navigation on desktop
async function DesktopNavbar() {
  // Get currently logged-in user using Clerk’s server-side helper
  const user = await currentUser();

  return (
    <div className="hidden md:flex items-center space-x-4">

      {/* Home Button */}
      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {user ? (
        <>
        {/* Notifications button (only shown if user is signed in) */}
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/notifications">
              <BellIcon className="w-4 h-4"/>
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </Button>

          {/* Profile button (only shown if user is signed in) */}
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            {/* For profile URL */}
            <Link href={`/profile/${
                user.username ??
                user.emailAddresses[0].emailAddress.split("@")[0]
              }`}>
              <UserIcon className="w-4 h-4"/>
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>

          <UserButton/>
        </>
      ) : (
        // If no user signed in, show Sign In button
        // TO DO: change cursor on hover
        <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
}

export default DesktopNavbar;
