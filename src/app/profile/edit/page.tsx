import { auth } from "@clerk/nextjs/server"; // server-side auth
import EditProfileForm from "@/components/ui/EditProfileForm";

export default async function EditProfilePage() {
  // Get the current session (server-side)
  const session = await auth();

  if (!session?.userId) {
    return <p>Please log in to edit your profile.</p>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Fetch profile by Clerk userId
  const res = await fetch(`${baseUrl}/api/profile/${session.userId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <p>Profile not found</p>;
  }

  const { data: profile } = await res.json();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <EditProfileForm initialData={profile} />
      </div>
    </div>
  );
}
