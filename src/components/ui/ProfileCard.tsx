"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface ProfileCardProps {
  username: string;
  clerkUserId: string;
  instrumentsArray?: string[];
  location?: string;
  preferredGenre?: string;
  contact?: string;
}

export default function ProfileCard({
  username,
  clerkUserId,
  instrumentsArray = [],
  location,
  preferredGenre,
  contact,
}: ProfileCardProps) {
  const { userId } = useAuth();
  const router = useRouter();
  const isOwner = userId === clerkUserId;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?"))
      return;

    try {
      const res = await fetch(`/api/profile/${username}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to delete profile");
      alert("Profile deleted!");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Error deleting profile");
    }
  };

  return (
    <Card className="max-w-sm w-full bg-white border border-gray-200 rounded-2xl p-6">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-2xl font-semibold">{username}</CardTitle>
        <p className="text-sm text-gray-500">{location?.trim() || "N/A"}</p>
      </CardHeader>
      <CardContent className="space-y-3 text-gray-800 text-sm">
        <div>
          <strong>Genres:</strong> {preferredGenre || "N/A"}
        </div>
        <div>
          <strong>Instruments:</strong> {instrumentsArray.join(", ") || "N/A"}
        </div>
        <div>
          <strong>Contact:</strong> {contact || "N/A"}
        </div>

        {isOwner && (
          <div className="flex flex-col space-y-2 mt-4">
            <button
              onClick={() => router.push("/profile/edit")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
            >
              Edit Profile
            </button>
            <button
              onClick={handleDelete}
              className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded"
            >
              Delete Profile
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
