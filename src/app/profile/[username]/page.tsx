import ProfileCard from "@/components/ui/ProfileCard";

interface ProfilePageProps {
  params: { username: string }; // dynamic route parameter
}

// profile page for a specific username
export default async function ProfilePage({ params }: ProfilePageProps) {
  // await the params object to extract the username
  const { username } = await params;

  // fetch user data from API route; no caching to always get fresh data
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/profile/${username}`,
    { cache: "no-store" }
  );

  // if user is not found, show simple message centered on the page
  if (!res.ok) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600 text-lg">User not found</p>
      </div>
    );
  }

  // parse the JSON response
  const json = await res.json();
  const user = json.data; //  extract the data object

  console.log("Fetched user:", user);

  // render ProfileCard
  return (
    <div className="flex justify-center">
      <ProfileCard
        username={user.username}
<<<<<<< HEAD
        instrumentsArray={user.instrumentsArray || []} // fallback if empty
        location={user.location}
        preferredGenre={user.preferredGenre}
        contact={user.contact}
=======
        instrumentsArray={user.instrumentsArray || []}
        location={user.location}
        preferredGenre={user.preferredGenre}
        contact={user.contact}
        clerkUserId={user.clerkUserId}
>>>>>>> f396a51 (Reinitialize repo and reconnect to GitHub)
      />
    </div>
  );
}
