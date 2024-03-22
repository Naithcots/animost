"use client";
import ErrorAlert from "@/components/alert/error-alert";
import LibraryAnimeCard from "@/components/library-anime-card";
import Select from "@/components/select";
import AnimeCardSkeleton from "@/components/skeleton/anime-card-skeleton";
import getUserLibrary from "@/lib/queries/getUserLibrary";
import { LibraryStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TEMP_FETCH_LIMIT = 8;

const LibraryPage = () => {
  const session = useSession();
  const router = useRouter();

  const [status, setStatus] = useState<LibraryStatus>(LibraryStatus.WATCHING);
  const selectItems = [
    { name: "Watching", value: LibraryStatus.WATCHING },
    { name: "Completed", value: LibraryStatus.COMPLETED },
    { name: "Planned", value: LibraryStatus.PLANNING },
    { name: "Paused", value: LibraryStatus.PAUSED },
    { name: "Dropped", value: LibraryStatus.DROPPED },
  ];

  useEffect(() => {
    if (session.status === "unauthenticated") router.push("/");
  }, [session, router]);

  const {
    data: animeLibrary,
    isLoading: animesIsLoading,
    refetch: animesManualRefetch,
  } = useQuery({
    queryKey: ["library", { sessionUser: session.data?.user.id, status }],
    queryFn: () => getUserLibrary(),
    enabled: !!session.data?.user,
    refetchOnMount: true,
  });

  const completedAnimeLibrary = animeLibrary?.filter(
    (entry) => entry.status === "COMPLETED",
  );
  const watchingAnimeLibrary = animeLibrary?.filter(
    (entry) => entry.status === "WATCHING",
  );
  const plannedAnimeLibrary = animeLibrary?.filter(
    (entry) => entry.status === "PLANNING",
  );
  const pausedAnimeLibrary = animeLibrary?.filter(
    (entry) => entry.status === "PAUSED",
  );
  const droppedAnimeLibrary = animeLibrary?.filter(
    (entry) => entry.status === "DROPPED",
  );

  const animesByStatusMap = {
    [LibraryStatus.WATCHING]: watchingAnimeLibrary,
    [LibraryStatus.COMPLETED]: completedAnimeLibrary,
    [LibraryStatus.PLANNING]: plannedAnimeLibrary,
    [LibraryStatus.PAUSED]: pausedAnimeLibrary,
    [LibraryStatus.DROPPED]: droppedAnimeLibrary,
  };

  const categoryNameByStatusMap = {
    [LibraryStatus.WATCHING]: "Currently Watching",
    [LibraryStatus.COMPLETED]: "Completed Shows",
    [LibraryStatus.PLANNING]: "Planned Shows",
    [LibraryStatus.PAUSED]: "Paused Shows",
    [LibraryStatus.DROPPED]: "Dropped Shows",
  };

  if (session.status === "loading" || session.status === "unauthenticated")
    return <></>;

  return (
    <>
      <h1 className="text-3xl font-semibold">Your Library</h1>

      <div className="mt-3">
        <Select
          name="Status"
          value={status}
          setValue={setStatus}
          disabled={false}
          items={selectItems}
        />
      </div>

      <div className="mt-3 flex flex-col gap-y-3">
        <div className="my-2">
          <h2 className="mb-3 text-2xl">{categoryNameByStatusMap[status]}</h2>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {!!animesByStatusMap[status]?.length ? (
              animesByStatusMap[status]?.map((libraryEntry) => (
                <LibraryAnimeCard data={libraryEntry} key={libraryEntry.id} />
              ))
            ) : animesByStatusMap[status] ? (
              <p>No entries.</p>
            ) : animesIsLoading ? (
              [...Array(TEMP_FETCH_LIMIT)].map((_, idx) => (
                <AnimeCardSkeleton key={idx} />
              ))
            ) : (
              <ErrorAlert
                title="Error while loading data.."
                description="Please try again by clicking at the button below."
                onClick={animesManualRefetch}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryPage;
