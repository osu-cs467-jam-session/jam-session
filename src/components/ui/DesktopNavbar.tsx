// Next.js
import Link from "next/link";

// Clerk (authentication service)
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";

// Icons from lucide-react
import {
  BellIcon,
  HomeIcon,
  UserIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";

// Custom Button component
import { Button } from "@/components/ui/button";

// ***************************************************************

// Desktop navigation bar
async function DesktopNavbar() {
  // get currently signed-in user (server-side)
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
          {/* Profile */}
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
              href={`/profile/${
                user.username ??
                user.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>

          {/* Create Profile */}
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/profile/create">
              <PlusIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Create Profile</span>
            </Link>
          </Button>

          {/* Browse Profiles */}
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/profile">
              <UsersIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Browse Profiles</span>
            </Link>
          </Button>

          {/* Clerk User Button */}
          <UserButton />
        </>
      ) : (
        // Sign In
        <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
}

export default DesktopNavbar;
