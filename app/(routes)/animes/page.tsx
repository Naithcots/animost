"use client";
import useDebounce from "@/app/hooks/use-debounce";
import ErrorAlert from "@/components/alert/error-alert";
import AnimesGrid from "@/components/animes-grid";
import Filters from "@/components/filters";
import Select from "@/components/select";
import AnimeCardSkeleton from "@/components/skeleton/anime-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import getGenresAnime from "@/lib/queries/jikan/getGenresAnime";
import getSearchAnime from "@/lib/queries/jikan/getSearchAnime";
import { AnimeOrderBy, AnimeStatus } from "@/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";

const FETCH_LIMIT = 24;
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
    data: animesRes,
    fetchNextPage: animesFetchNextPage,
    hasNextPage: animesHasNextPage,
    isFetching: animesIsFetching,
    isFetchingNextPage: animesIsFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["animes", debouncedSearchInput, genres, status, orderBy],
    queryFn: ({ pageParam }) =>
      getSearchAnime({
        q: debouncedSearchInput,
        page: pageParam,
        limit: FETCH_LIMIT,
        sfw: true,
        genres: genres.join(","),
        status,
        order_by: orderBy,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (!lastPage?.pagination || !lastPage?.pagination?.has_next_page)
        return undefined;
      return lastPageParam + 1;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: genresRes, refetch: genresManualRefetch } = useQuery({
    queryKey: ["anime_genres"],
    queryFn: () => getGenresAnime({ filter: "genres" }),
  });

  const animesData = animesRes;
  const genresData = genresRes?.data;

  return (
    <>
      <div>
        <Input
          placeholder="Search.."
          className="w-full md:max-w-[450px]"
          disabled={animesIsFetching || !animesData}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <div className="mt-2 flex gap-x-2">
          <Select
            name="Status"
            value={status}
            setValue={setSelectStatus}
            disabled={animesIsFetching || !animesData}
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
            disabled={animesIsFetching || !animesData}
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

        {genresData ? (
          <div className="mt-3">
            <Filters
              items={genresData}
              checkedArray={genres}
              toggle={toggleGenre}
            />
          </div>
        ) : (
          <div className="h-12"></div>
        )}
      </div>

      {animesData && !!animesData.pages.length ? (
        <div className="mt-5">
          <AnimesGrid data={animesData} />
          <div className="text-center">
            <Button
              className="mt-5 mb-5"
              disabled={!animesHasNextPage || animesIsFetchingNextPage}
              onClick={() => animesFetchNextPage()}
            >
              {animesIsFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          </div>
        </div>
      ) : animesIsFetching ? (
        <div className="my-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {[...Array(FETCH_LIMIT)].map((_, idx) => (
            <AnimeCardSkeleton key={idx} />
          ))}
        </div>
      ) : (
        <div className="my-5">
          <ErrorAlert
            title="External API Error!"
            description="Unfortunately this is an error of external API we use to run this
  site. Please wait a while and click button below."
            onClick={() => genresManualRefetch()}
          />
        </div>
      )}
    </>
  );
};

export default AnimesPage;
