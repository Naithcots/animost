import qs from "query-string";

type GetSearchAnimeParams = {
  page: number;
  limit: number;
  q: string;
  sfw: boolean;
  type?: "g" | "pg" | "pg13" | "r17" | "r" | "rx";
  rating?: "g" | "pg" | "pg13" | "r17" | "r" | "rx";
  status?: "all" | "airing" | "complete" | "upcoming";
  min_score?: number;
  max_score?: number;
  genres?: string;
  genres_exclude?: string;
  order_by?:
    | "mal_id"
    | "title"
    | "start_date"
    | "end_date"
    | "episodes"
    | "score"
    | "scored_by"
    | "rank"
    | "popularity"
    | "members"
    | "favorites";
  sort?: "asc" | "desc";
  letter?: string;
  start_date?: string;
  end_date?: string;
};

export default async function getSearchAnime({
  page,
  limit,
  type,
  q,
  rating,
  sfw,
  end_date,
  genres,
  genres_exclude,
  max_score,
  min_score,
  order_by,
  sort,
  start_date,
  status,
}: GetSearchAnimeParams) {
  const url = qs.stringifyUrl(
    {
      url: "https://api.jikan.moe/v4/anime",
      query: {
        page,
        limit,
        type,
        q,
        rating,
        sfw,
        end_date,
        genres,
        genres_exclude,
        max_score,
        min_score,
        order_by,
        sort,
        start_date,
        status: status === "all" ? null : status,
      },
    },
    { skipNull: true }
  );

  const response = await fetch(url);
  return await response.json();
}
