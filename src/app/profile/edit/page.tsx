import EditProfileForm from "@/components/ui/EditProfileForm";

export default async function EditProfilePage() {
  // fetch current user's profile
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/profile`,
    { cache: "no-store" }
  );
  const profile = await res.json();

  if (!profile) return <p>Profile not found</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <EditProfileForm initialData={profile} />
      </div>
    </div>
  );
}
