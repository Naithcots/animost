import getPopularAnime from "@/app/jikan/getPopularAnime";
import AnimeCard from "@/components/anime-card";

const Home = async () => {
  const mostPopularAnime = await getPopularAnime({
    filter: "airing",
    sfw: true,
    page: 1,
    limit: 10,
  });

  return (
    <main className="container mx-auto max-w-8xl mt-3">
      <div>
        <p className="mb-3 text-2xl font-bold">Most Popular Airing🔥</p>
        <div className="grid grid-cols-6 gap-4">
          {mostPopularAnime.data.map((item: any) => (
            <AnimeCard data={item} key={item.mal_id} />
          ))}
        </div>
      </div>
    </main>
  );
};
export default Home;
