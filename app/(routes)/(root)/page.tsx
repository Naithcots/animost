"use client";
import ErrorAlert from "@/components/alert/error-alert";
import AnimeCard from "@/components/anime-card";
import Carousel from "@/components/carousel/carousel";
import AnimeCardSkeleton from "@/components/skeleton/anime-card-skeleton";
import getPopularAnime from "@/lib/queries/jikan/getPopularAnime";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const FETCH_LIMIT = 16;

const Home = () => {
  const router = useRouter();

  const { data: airingAnimeRes, isLoading: airingAnimeIsLoading } = useQuery({
    queryKey: ["airing"],
    queryFn: () =>
      getPopularAnime({
        filter: "airing",
        sfw: true,
        page: 1,
        limit: FETCH_LIMIT,
      }),
  });

  const { data: upcomingAnimeRes, isLoading: upcomingAnimeIsLoading } =
    useQuery({
      queryKey: ["upcoming"],
      queryFn: () =>
        getPopularAnime({
          filter: "upcoming",
          sfw: true,
          page: 1,
          limit: FETCH_LIMIT,
        }),
    });

  const airingAnimeData = airingAnimeRes?.data;
  const upcomingAnimeData = upcomingAnimeRes?.data;

  return (
    <>
      {airingAnimeData && <div>
        <Carousel items={airingAnimeData} />
      </div>}
      <div>
        <p className="mb-3 text-2xl font-bold">Top Airing Anime🔥</p>
        {airingAnimeData ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {airingAnimeData.map((item: any) => (
              <AnimeCard data={item} key={item.mal_id} />
            ))}
          </div>
        ) : airingAnimeIsLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {[...Array(FETCH_LIMIT)].map((_, idx) => (
              <AnimeCardSkeleton key={idx} />
            ))}
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

      <div className="mt-6 mb-8">
        <p className="mb-3 text-2xl font-bold">Top Upcoming Anime🔜</p>
        {upcomingAnimeData ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {upcomingAnimeData.map((item: any) => (
              <AnimeCard data={item} key={item.mal_id} />
            ))}
          </div>
        ) : upcomingAnimeIsLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {[...Array(FETCH_LIMIT)].map((_, idx) => (
              <AnimeCardSkeleton key={idx} />
            ))}
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
