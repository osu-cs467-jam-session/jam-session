// Next.js
import Link from "next/link"; // used for client-side navigation between pages

// Custom Components
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

// ***************************************************************

// define primary NavBar component that appears at top of app
function NavBar() {
  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* links to homepage */}
            <Link
              href="/"
              className="text-xl font-bold text-primary font-mono tracking-wider">
              Jam Session
            </Link>
          </div>
          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
