import React from "react";
import Link from "next/link";

interface Profile {
  clerkUserId: string; // unique ID from Clerk
  username?: string; // optional username
  preferredGenre?: string; // optional preferred genre
}

export default async function ProfileListPage() {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/profile`,
    { cache: "no-store" }
  );

  const profiles: Profile[] = await res.json(); // <-- updated line

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">All Profiles</h1>
      <ul className="space-y-2">
        {profiles.map((p) => (
          <li key={p.clerkUserId}>
            <Link
              href={`/profile/${p.username || p.clerkUserId}`}
              className="text-blue-500"
            >
              {p.username || "No username"} — {p.preferredGenre || "No genre"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
