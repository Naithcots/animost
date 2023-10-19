import { Library, LibraryAnime } from "@prisma/client";

type AnimeStatus = "all" | "airing" | "complete" | "upcoming";
type AnimeOrderBy =
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

type Anime = {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
    images: {
      image_url: string;
      small_image_url: string;
      medium_image_url: string;
      large_image_url: string;
      maximum_image_url: string;
    };
  };
  approved: true;
  titles: {
    type: string;
    title: string;
  }[];
  title_synonyms: string[];
  type: "TV" | "OVA" | "Movie" | "Special" | "ONA" | "Music";
  source: string;
  episodes: number | null;
  status: "Finished Airing" | "Currently Airing" | "Not yet aired";
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    prop: {
      from: {
        day: number | null;
        month: number | null;
        year: number | null;
      };
      to: {
        day: number | null;
        month: number | null;
        year: number | null;
      };
    };
    string: string;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: "summer" | "winter" | "spring" | "fall";
  year: number;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  licensors: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  studios: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  genres: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  explicit_genres: [];
  themes: [];
  demographics: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
};

type LibraryWithLibraryAnime = Library & {
  LibraryAnime: LibraryAnime;
};

type JikanAPIErrorType = {
  error: string;
  status: number;
  type: string;
  messages: { [type: string]: string };
};

export type { AnimeOrderBy, AnimeStatus, Anime, LibraryWithLibraryAnime, JikanAPIErrorType };
