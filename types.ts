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

export type {
  AnimeOrderBy,
  AnimeStatus,
  Anime,
  LibraryWithLibraryAnime,
  JikanAPIErrorType,
};

export interface MALImportFile {
  _declaration: Declaration;
  _comment: string;
  myanimelist: Myanimelist;
}

export interface Declaration {
  _attributes: Attributes;
}

export interface Attributes {
  version: string;
  encoding: string;
}

export interface Myanimelist {
  myinfo: Myinfo;
  anime: ImportAnime[];
}

export interface ImportAnime {
  series_animedb_id: UserExportType;
  series_title: SeriesTitle;
  series_type: UserExportType;
  series_episodes: UserExportType;
  my_id: UserExportType;
  my_watched_episodes: UserExportType;
  my_start_date: UserExportType;
  my_finish_date: UserExportType;
  my_rated: My;
  my_score: UserExportType;
  my_storage: My;
  my_storage_value: UserExportType;
  my_status: UserExportType;
  my_comments: My;
  my_times_watched: UserExportType;
  my_rewatch_value: My;
  my_priority: UserExportType;
  my_tags: My;
  my_rewatching: UserExportType;
  my_rewatching_ep: UserExportType;
  my_discuss: UserExportType;
  my_sns: UserExportType;
  update_on_import: UserExportType;
}

export interface My {}

export interface UserExportType {
  _text: string;
}

export interface SeriesTitle {
  _cdata: string;
}

export interface Myinfo {
  user_id: UserExportType;
  user_name: UserExportType;
  user_export_type: UserExportType;
  user_total_anime: UserExportType;
  user_total_watching: UserExportType;
  user_total_completed: UserExportType;
  user_total_onhold: UserExportType;
  user_total_dropped: UserExportType;
  user_total_plantowatch: UserExportType;
}

// Unsure
export type MALUserAnimeStatus =
  | "Completed"
  | "Watching"
  | "Plan to Watch"
  | "On-Hold"
  | "Dropped";
