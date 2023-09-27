import qs from "query-string";

type GetPopularAnimeParams = {
  type?: "g" | "pg" | "pg13" | "r17" | "r" | "rx";
  filter?: "airing" | "upcoming" | "bypopularity" | "favorite";
  rating?: "g" | "pg" | "pg13" | "r17" | "r" | "rx";
  sfw: boolean;
  page: number;
  limit: number;
};

export default async function getPopularAnime({
  filter,
  limit,
  page,
  rating,
  sfw,
  type,
}: GetPopularAnimeParams) {
  const url = qs.stringifyUrl(
    {
      url: "https://api.jikan.moe/v4/top/anime",
      query: { filter, limit, page, rating, sfw, type },
    },
    { skipNull: true }
  );

  const response = await fetch(url);
  return await response.json();
}
