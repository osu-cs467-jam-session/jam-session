import { auth } from "@clerk/nextjs/server";
import EditProfileForm from "@/components/ui/EditProfileForm";
import { connectToDatabase } from "@/app/lib/database";
import ProfileModel from "@/app/models/profile";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.userId) {
    return <p>Please log in to edit your profile.</p>;
  }

  await connectToDatabase();
  const profile = await ProfileModel.findOne({
    clerkUserId: session.userId,
  }).lean();

  if (!profile) {
    return <p>Profile not found</p>;
  }

  const safeProfile = JSON.parse(JSON.stringify(profile));

  return <EditProfileForm initialData={safeProfile} />;
}
