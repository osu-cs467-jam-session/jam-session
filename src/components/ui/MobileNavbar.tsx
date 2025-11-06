// allows component to run on client side
"use client";

// ***************************************************************

import { useState } from "react";

// Next.js
import Link from "next/link"; // used for navigation linking

// Clerk (authentication service)
import { useAuth, SignInButton, SignOutButton } from "@clerk/nextjs";

// icons from React library
import { BellIcon, HomeIcon, LogOutIcon, MenuIcon, UserIcon} from "lucide-react";

// custom Button component
import { Button } from "@/components/ui/button";

// sheet component from shadcn (component library)
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";

// ***************************************************************

// define component for navigation on mobile device
function MobileNavbar() {
  // React hook to track if menu is open or closed
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // get user's sign-in status from Clerk
  const { isSignedIn } = useAuth();

  return (
    // outer wrapper for nav bar; only visible on mobile screens
    <div className="flex md:hidden items-center space-x-2">

      {/* sheet compoinent used for mobile menu */}
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col space-y-4 mt-6">
            {/* Home Button In Mobile Menu */}
            <Button
              variant="ghost"
              className="flex items-center gap-3 justify-start"
              asChild>
              <Link href="/">
                <HomeIcon className="w-4 h-4"/>
                Home
              </Link>
            </Button>

            {/* only show if user signed in */}
            {isSignedIn ? (
              <>
              {/* Notifications Button In Mobile Menu */}
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 justify-start"
                  asChild>
                  <Link href="/notifications">
                    <BellIcon className="w-4 h-4"/>
                    Notifications
                  </Link>
                </Button>

                {/* Profile Button In Mobile Menu */}
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 justify-start"
                  asChild>
                  <Link href="/profile">
                    <UserIcon className="w-4 h-4"/>
                    Profile
                  </Link>
                </Button>

                {/* Sign Out Button In Mobile Menu */}
                <SignOutButton>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start w-full">
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </Button>
                </SignOutButton>
              </>
            ) :
            
            ( // {/* Sign In Button In Mobile Menu */}
              <SignInButton mode="modal">
                <Button variant="default" className="w-full">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
