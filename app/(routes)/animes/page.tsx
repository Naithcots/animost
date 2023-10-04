"use client";
import useDebounce from "@/app/hooks/use-debounce";
import getGenresAnime from "@/lib/queries/jikan/getGenresAnime";
import getSearchAnime from "@/lib/queries/jikan/getSearchAnime";
import AnimesGrid from "@/components/animes-grid";
import Filters from "@/components/filters";
import Select from "@/components/select";
import { Input } from "@/components/ui/input";
import { AnimeOrderBy, AnimeStatus } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const DEFAULT_ORDERBY: AnimeOrderBy = "popularity";
const DEFAULT_STATUS: AnimeStatus = "all";

const AnimesPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<AnimeStatus>(DEFAULT_STATUS);
  const [orderBy, setOrderBy] = useState<AnimeOrderBy>(DEFAULT_ORDERBY);
  const [genres, setGenres] = useState<number[]>([]);
  const debouncedSearchInput = useDebounce(searchInput, 500);

  const toggleGenre = (genreValue: number) => {
    if (genres.includes(genreValue)) {
      setGenres(genres.filter((genre) => genre !== genreValue));
    } else {
      setGenres([...genres, genreValue]);
    }
  };
  const setSelectStatus = (val: AnimeStatus) => setStatus(val);
  const setOrderByStatus = (val: AnimeOrderBy) => setOrderBy(val);

  const {
    data: animesData,
    isLoading: animesIsLoading,
    isError: animesIsError,
  } = useQuery(["animes", debouncedSearchInput, genres, status, orderBy], () =>
    getSearchAnime({
      q: debouncedSearchInput,
      sfw: true,
      page: 1,
      limit: 20,
      genres: genres.join(","),
      status,
      order_by: orderBy,
    })
  );

  const {
    data: genresData,
    isLoading: genresIsLoading,
    isError: genresIsError,
  } = useQuery(["anime_genres"], () => getGenresAnime({ filter: "genres" }));

  return (
    <main className="container mx-auto max-w-8xl mt-6">
      <div>
        <Input
          placeholder="Search.."
          className="w-full md:max-w-[450px]"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <div className="mt-2 flex gap-x-2">
          <Select
            name="Status"
            value={status}
            setValue={setSelectStatus}
            items={[
              { name: "All", value: "all" },
              { name: "Airing", value: "airing" },
              { name: "Completed", value: "complete" },
              { name: "Upcoming", value: "upcoming" },
            ]}
          />

          <Select
            name="Order By"
            value={orderBy}
            setValue={setOrderByStatus}
            items={[
              { name: "Title", value: "title" },
              { name: "Start Date", value: "start_date" },
              { name: "End Date", value: "end_date" },
              { name: "Episodes", value: "episodes" },
              { name: "Score", value: "score" },
              { name: "Popularity", value: "popularity" },
            ]}
          />
        </div>

        {!genresIsLoading && genresData && genresData.data && (
          <div className="mt-2">
            <Filters
              items={genresData}
              checkedArray={genres}
              toggle={toggleGenre}
            />
          </div>
        )}
      </div>

      {!animesIsLoading && animesData && animesData.data && (
        <div className="mt-6">
          <AnimesGrid data={animesData} />
        </div>
      )}
    </main>
  );
};

export default AnimesPage;
