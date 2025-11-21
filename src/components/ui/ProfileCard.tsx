import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileCardProps {
  username: string;
  instrumentsArray?: string[];
  location?: string;
  preferredGenre?: string;
  contact?: string;
}

export default function ProfileCard({
  username,
  instrumentsArray = [],
  location,
  preferredGenre,
  contact,
}: ProfileCardProps) {
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
      </CardContent>
    </Card>
  );
}
