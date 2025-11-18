import React from "react";

export const metadata = {
  title: "Profile",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // full viewport height with light background
    <div className="min-h-screen bg-gray-50">
      {/* Center content vertically and horizontally, keep a max width for readability */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
