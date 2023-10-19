import getPopularAnime from "@/lib/queries/jikan/getPopularAnime";
import AnimeCard from "@/components/anime-card";
import LoadingHome from "./loading";

const Home = async () => {
  const topAiringAnimeReq = getPopularAnime({
    filter: "airing",
    sfw: true,
    page: 1,
    limit: 16,
  });

  const topUpcomingAnimeReq = getPopularAnime({
    filter: "upcoming",
    sfw: true,
    page: 1,
    limit: 16,
  });

  const [topAiringAnime, topUpcomingAnime] = await Promise.all([topAiringAnimeReq, topUpcomingAnimeReq])

  return (
    <>
      <div>
        <p className="mb-3 text-2xl font-bold">Top Airing Anime🔥</p>
        <div className="grid grid-cols-2 sm:grid-cols-4  lg:grid-cols-8 gap-4">
          {topAiringAnime.data.map((item: any) => (
            <AnimeCard data={item} key={item.mal_id} />
          ))}
        </div>
      </div>
      <div className="mt-6">
        <p className="mb-3 text-2xl font-bold">Top Upcoming Anime🔜</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {topUpcomingAnime.data.map((item: any) => (
            <AnimeCard data={item} key={item.mal_id} />
          ))}
        </div>
      </div>
    </>
  );
};
export default Home;
