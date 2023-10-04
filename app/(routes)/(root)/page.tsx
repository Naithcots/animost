import getPopularAnime from "@/lib/queries/jikan/getPopularAnime";
import AnimeCard from "@/components/anime-card";

const Home = async () => {
  const topAiringAnime = await getPopularAnime({
    filter: "airing",
    sfw: true,
    page: 1,
    limit: 16,
  });

  const topUpcomingAnime = await getPopularAnime({
    filter: "upcoming",
    sfw: true,
    page: 1,
    limit: 16,
  });

  return (
    <main className="container mx-auto max-w-8xl mt-3">
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
    </main>
  );
};
export default Home;
