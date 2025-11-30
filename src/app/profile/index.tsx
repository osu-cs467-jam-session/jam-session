"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Profile {
  clerkUserId: string;
  username?: string;
  preferredGenre?: string;
}

export default function ProfileListPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/profile${query ? `?q=${encodeURIComponent(query)}` : ""}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch profiles");

        const data: Profile[] = await res.json();
        setProfiles(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [query]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">All Profiles</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search users…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Loading state */}
      {loading && <p className="text-gray-500">Loading profiles…</p>}

      {/* Error state */}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Profiles list */}
      {!loading && !error && (
        <>
          {profiles.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <ul className="space-y-2">
              {profiles.map((p) => (
                <li key={p.clerkUserId}>
                  <Link
                    href={`/profile/${p.username || p.clerkUserId}`}
                    className="text-blue-500"
                  >
                    {p.username || "No username"} —{" "}
                    {p.preferredGenre || "No genre"}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
