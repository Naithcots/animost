import qs from "query-string";

type GetGenresAnimeParams = {
  filter: "genres" | "explicit_genres" | "themes" | "demographics";
};

export default async function getGenresAnime({ filter }: GetGenresAnimeParams) {
  const url = qs.stringifyUrl(
    {
      url: "https://api.jikan.moe/v4/genres/anime",
      query: { filter },
    },
    { skipNull: true }
  );

  const response = await fetch(url);
  if (!response.ok) throw new Error();
  return await response.json();
}
