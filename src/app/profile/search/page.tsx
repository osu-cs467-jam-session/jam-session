"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Profile {
  clerkUserId: string; // unique ID from Clerk
  username?: string; // optional username
  preferredGenre?: string; // optional preferred genre
}

export default function ProfileListPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch profiles from API with optional search query
  const fetchProfiles = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/all_profiles?search=${encodeURIComponent(query)}`,
        { cache: "no-store" }
      );

      const json = await res.json();
      setProfiles(json.data || []);
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  // fetch all profiles
  useEffect(() => {
    fetchProfiles();
  }, []);

  // debounce search input to avoid firing request on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProfiles(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">All Profiles</h1>

      <input
        type="text"
        placeholder="Search by username or genre"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full max-w-sm"
      />

      {loading ? (
        <p>Loading profiles...</p>
      ) : profiles.length ? (
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
      ) : (
        <p>No profiles found</p>
      )}
    </div>
  );
}
