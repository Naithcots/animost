import { useServerSession } from "@/app/api/auth/[...nextauth]/route";
import LibraryAnimeCard from "@/components/library-anime-card";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export const revalidate = 0;

const LibraryPage = async () => {
  const session = await useServerSession();
  if (!session?.user) redirect("/");

  const animeLibrary = await db.library.findMany({
    where: {
      user: {
        googleId: session.user.id,
      },
      type: "ANIME",
    },
    include: {
      LibraryAnime: true,
    },
  });

  const completedAnimeLibrary = animeLibrary.filter(
    (entry) => entry.status === "COMPLETED"
  );
  const watchingAnimeLibrary = animeLibrary.filter(
    (entry) => entry.status === "WATCHING"
  );
  const plannedAnimeLibrary = animeLibrary.filter(
    (entry) => entry.status === "PLANNING"
  );
  const pausedAnimeLibrary = animeLibrary.filter(
    (entry) => entry.status === "PAUSED"
  );
  const droppedAnimeLibrary = animeLibrary.filter(
    (entry) => entry.status === "DROPPED"
  );

  return (
    <main className="container mx-auto max-w-8xl my-4">
      <h1 className="text-3xl font-semibold">Your Library</h1>
      <div className="flex flex-col gap-y-3 mt-3">
        <div className="my-2">
          <h2 className="text-2xl mb-3">Currently Watching</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {!!watchingAnimeLibrary.length ? (
              watchingAnimeLibrary.map((libraryEntry) => (
                <LibraryAnimeCard data={libraryEntry} key={libraryEntry.id} />
              ))
            ) : (
              <p>No entries.</p>
            )}
          </div>
        </div>
        <div className="my-2">
          <h2 className="text-2xl mb-3">Planned To Watch</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {!!plannedAnimeLibrary.length ? (
              plannedAnimeLibrary.map((libraryEntry) => (
                <LibraryAnimeCard data={libraryEntry} key={libraryEntry.id} />
              ))
            ) : (
              <p>No entries.</p>
            )}
          </div>
        </div>
        <div className="my-2">
          <h2 className="text-2xl mb-3">Completed Shows</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {!!completedAnimeLibrary.length ? (
              completedAnimeLibrary.map((libraryEntry) => (
                <LibraryAnimeCard data={libraryEntry} key={libraryEntry.id} />
              ))
            ) : (
              <p>No entries.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
export default LibraryPage;
