import { useServerSession } from "@/app/api/auth/[...nextauth]/route";
import MalFileForm from "@/components/settings/mal-file-form";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const session = await useServerSession();
  if (!session?.user) return redirect("/");

  return (
    <div>
      <h1 className="mb-3 text-3xl font-bold">Settings</h1>
      <div>
        <h2 className="mb-1 text-2xl font-semibold">Library</h2>
        <h3 className="text-lg">Import Anime from MyAnimeList</h3>
        <p className="-mt-1 opacity-80">
          Import an XML file with your anime list below
        </p>
        <span className="block -mt-1 text-red-500">
          WARNING! It will override all existing items
        </span>
        <MalFileForm />
      </div>
    </div>
  );
};
export default SettingsPage;
