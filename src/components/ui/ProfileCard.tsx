import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// props expected by ProfileCard component
interface ProfileCardProps {
  username: string;             // User's display name
  instrumentsArray?: string[];  // Optional array of instruments
  location: string;             // User's location
  preferredGenre: string;       // User's favorite genre
  contact: string;              // Contact information
}

export default function ProfileCard({
  username,
  instrumentsArray = [], // default to empty array if undefined
  location,
  preferredGenre,
  contact,
}: ProfileCardProps) {
  return (
    // main Card container for user profile
    <Card className="max-w-sm w-full bg-white border border-gray-200 rounded-2xl p-6">
      
      {/* header section with username and location */}
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-900">
          {username}
        </CardTitle>
        <p className="text-sm text-gray-500">{location}</p>
      </CardHeader>

      {/* card content showing preferred genre, instruments, and contact */}
      <CardContent className="space-y-3 text-gray-800 text-sm">
        <div>
          <span className="font-medium text-gray-700">Preferred Genre:</span>{" "}
          {preferredGenre || "N/A"}
        </div>
        <div>
          <span className="font-medium text-gray-700">Instruments:</span>{" "}
          {instrumentsArray.length ? instrumentsArray.join(", ") : "N/A"}
        </div>
        <div>
          <span className="font-medium text-gray-700">Contact:</span> {contact || "N/A"}
        </div>
      </CardContent>
    </Card>
  );
}
