import MalFileForm from "@/components/settings/mal-file-form";
import { useServerSession } from "@/lib/utils";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const session = await useServerSession();
  if (!session?.user) return redirect("/");

  return (
    <div>
      <h1 className="mb-3 text-3xl font-bold">Settings</h1>
      <div>
        <h2 className="mb-1 text-2xl font-semibold">Library</h2>
        <h3 className="text-lg font-semibold">Import Anime from myanimelist.net</h3>
        <p className="text-muted-foreground">
          Upload an XML file with your anime list from mal below.
        </p>
        <MalFileForm />
      </div>
    </div>
  );
};
export default SettingsPage;
