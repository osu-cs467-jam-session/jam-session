import ProfileCard from "@/components/ui/ProfileCard";

interface ProfilePageProps {
  params: Promise<{ username: string }>; // params is a Promise
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/profile/${username}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>User not found</p>
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
