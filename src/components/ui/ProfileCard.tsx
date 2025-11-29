"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface ProfileCardProps {
  username: string;
  clerkUserId: string; // add this
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

  console.log("Logged in:", userId, "Profile owner:", clerkUserId);

  return (
    <Card className="max-w-sm w-full bg-white border border-gray-200 rounded-2xl p-6">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-900">
          {username}
        </CardTitle>
        <p className="text-sm text-gray-500">{location?.trim() || "N/A"}</p>
      </CardHeader>

      <CardContent className="space-y-3 text-gray-800 text-sm">
        <div>
          <span className="font-medium text-gray-700">Preferred Genre:</span>{" "}
          {preferredGenre?.trim() || "N/A"}
        </div>
        <div>
          <span className="font-medium text-gray-700">Instruments:</span>{" "}
          {instrumentsArray.length ? instrumentsArray.join(", ") : "N/A"}
        </div>
        <div>
          <span className="font-medium text-gray-700">Contact:</span>{" "}
          {contact?.trim() || "N/A"}
        </div>

        {isOwner && (
          <button
            onClick={() => router.push("/profile/edit")}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </CardContent>
    </Card>
  );
}
