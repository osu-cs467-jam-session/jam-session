import CreateProfileForm from "@/components/ui/CreateProfileForm";

export const metadata = {
  title: "Create Profile",
};

export default function CreateProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Profile</h1>
        <CreateProfileForm />
      </div>
    </div>
  );
}
// test
