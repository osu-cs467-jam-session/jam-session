"use client";
import React, { useState } from "react";

interface ProfileData {
  username?: string;
  instrumentsArray?: string[];
  preferredGenre?: string;
  location?: string;
  contact?: string;
}

interface EditProfileFormProps {
  initialData?: ProfileData;
  onUpdate?: (updated: ProfileData) => void;
}

export default function EditProfileForm({
  initialData = {},
  onUpdate,
}: EditProfileFormProps) {
  const [form, setForm] = useState<ProfileData>({
    ...initialData,
    instrumentsArray: initialData?.instrumentsArray || [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInstrumentChange = (index: number, value: string) => {
    const updated = [...(form.instrumentsArray || [])];
    updated[index] = value;
    setForm((prev) => ({ ...prev, instrumentsArray: updated }));
  };

  const addInstrument = () => {
    setForm((prev) => ({
      ...prev,
      instrumentsArray: [...(prev.instrumentsArray || []), ""],
    }));
  };

  const removeInstrument = (index: number) => {
    const updated = [...(form.instrumentsArray || [])];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, instrumentsArray: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/profile/${form.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Update failed");

      if (onUpdate) onUpdate(json.data);
      alert("Profile updated successfully!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username || ""}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="preferredGenre"
        placeholder="Preferred Genre"
        value={form.preferredGenre || ""}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={form.location || ""}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="contact"
        placeholder="Contact"
        value={form.contact || ""}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <div>
        <label className="block mb-1 font-semibold">Instruments</label>
        {(form.instrumentsArray || []).map((inst, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={inst}
              onChange={(e) => handleInstrumentChange(index, e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => removeInstrument(index)}
              className="bg-red-500 text-white px-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addInstrument}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Add Instrument
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
