import ProfileCard from "@/components/ui/ProfileCard";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params;

  // use relative URL so it works both locally and on vercel
  const res = await fetch(`/api/profile/${encodeURIComponent(username)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600 text-lg">User not found</p>
      </div>
    );
  }

  const { data: user } = await res.json();

  return (
    <div className="flex justify-center">
      <ProfileCard
        username={user.username}
        instrumentsArray={user.instrumentsArray || []}
        location={user.location}
        preferredGenre={user.preferredGenre}
        contact={user.contact}
        clerkUserId={user.clerkUserId}
      />
    </div>
  );
}
