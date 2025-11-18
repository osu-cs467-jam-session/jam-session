"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CreateProfileForm() {
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [preferredGenre, setPreferredGenre] = useState("");
  const [instruments, setInstruments] = useState(""); // comma-separated
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const instrumentsArray = instruments
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          location,
          preferredGenre,
          instrumentsArray,
          contact,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create profile");
      }

      // Optionally reset form after successful submit
      setUsername("");
      setLocation("");
      setPreferredGenre("");
      setInstruments("");
      setContact("");
      alert("Profile created!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto font-sans"
    >
      <h2 className="text-2xl font-semibold text-gray-900">Create Profile</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="font-sans text-gray-900"
      />
      <Input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="font-sans text-gray-900"
      />
      <Input
        placeholder="Preferred Genre"
        value={preferredGenre}
        onChange={(e) => setPreferredGenre(e.target.value)}
        className="font-sans text-gray-900"
      />
      <Input
        placeholder="Instruments (comma-separated)"
        value={instruments}
        onChange={(e) => setInstruments(e.target.value)}
        className="font-sans text-gray-900"
      />
      <Input
        placeholder="Contact"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="font-sans text-gray-900"
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Create Profile"}
      </Button>
    </form>
  );
}
