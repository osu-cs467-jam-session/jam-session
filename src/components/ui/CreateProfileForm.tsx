"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateProfileFormProps {}

export default function CreateProfileForm({}: CreateProfileFormProps) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [instruments, setInstruments] = useState("");
  const [preferredGenre, setPreferredGenre] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          instrumentsArray: instruments
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
          preferredGenre,
          location,
          contact,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to create profile");
      }

      const created = await res.json();

      // redirect to the newly created profile page
      router.push(`/profile/${created.username || created.clerkUserId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-6 rounded shadow-md w-full max-w-md"
    >
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Instruments (comma separated)"
        value={instruments}
        onChange={(e) => setInstruments(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Preferred Genre"
        value={preferredGenre}
        onChange={(e) => setPreferredGenre(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Contact Info"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Profile"}
      </button>
    </form>
  );
}
