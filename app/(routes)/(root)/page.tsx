"use client";
import ErrorAlert from "@/components/alert/error-alert";
import AnimeCard from "@/components/anime-card";
import getPopularAnime from "@/lib/queries/jikan/getPopularAnime";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Home = () => {
  const { data: airingAnimeRes, isLoading: airingAnimeIsLoading } = useQuery({
    queryKey: ["airing"],
    queryFn: () =>
      getPopularAnime({ filter: "airing", sfw: true, page: 1, limit: 16 }),
  });

  const { data: upcomingAnimeRes, isLoading: upcomingAnimeIsLoading } =
    useQuery({
      queryKey: ["upcoming"],
      queryFn: () =>
        getPopularAnime({ filter: "upcoming", sfw: true, page: 1, limit: 16 }),
    });

  const router = useRouter();

  const airingAnimeData = airingAnimeRes?.data;
  const upcomingAnimeData = upcomingAnimeRes?.data;

  return (
    <>
      <div>
        <p className="mb-3 text-2xl font-bold">Top Airing Anime🔥</p>
        {airingAnimeData ? (
          <div className="grid grid-cols-2 sm:grid-cols-4  lg:grid-cols-8 gap-4">
            {airingAnimeData.map((item: any) => (
              <AnimeCard data={item} key={item.mal_id} />
            ))}
          </div>
        ) : airingAnimeIsLoading ? (
          <div className="text-center w-full">
            <Loader2 className="mx-auto mt-4 mb-1 h-8 w-8 animate-spin" />
            <p>Loading Airing...</p>
          </div>
        ) : (
          <ErrorAlert
            title="Couldn't load collection.."
            description="Unfortunately this is an internal error of external API we use to run
            this site."
            onClick={() => router.refresh()}
          />
        )}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-2xl font-bold">Top Upcoming Anime🔜</p>

        {upcomingAnimeData ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {upcomingAnimeData.map((item: any) => (
              <AnimeCard data={item} key={item.mal_id} />
            ))}
          </div>
        ) : upcomingAnimeIsLoading ? (
          <div className="text-center w-full">
            <Loader2 className="mx-auto mt-4 mb-1 h-8 w-8 animate-spin" />
            <p>Loading Upcoming...</p>
          </div>
        ) : (
          <ErrorAlert
            title="Couldn't load collection.."
            description="Unfortunately this is an internal error of external API we use to run
          this site."
            onClick={() => router.refresh()}
          />
        )}
      </div>
    </>
  );
};
export default Home;
