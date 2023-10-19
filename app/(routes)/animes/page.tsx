"use client";
import useDebounce from "@/app/hooks/use-debounce";
import AnimesGrid from "@/components/animes-grid";
import Filters from "@/components/filters";
import Select from "@/components/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import getGenresAnime from "@/lib/queries/jikan/getGenresAnime";
import getSearchAnime from "@/lib/queries/jikan/getSearchAnime";
import { AnimeOrderBy, AnimeStatus, JikanAPIErrorType } from "@/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2, XCircle } from "lucide-react";
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

  // const {
  //   data: animesRes,
  //   isLoading: animesIsLoading,
  //   isInitialLoading: animesIsInitialLoading,
  //   refetch: animesManualRefetch,
  // } = useQuery(["animes", debouncedSearchInput, genres, status, orderBy], () =>
  //   getSearchAnime({
  //     q: debouncedSearchInput,
  //     sfw: true,
  //     page: 1,
  //     limit: 20,
  //     genres: genres.join(","),
  //     status,
  //     order_by: orderBy,
  //   })
  // );

  const {
    data: animesRes,
    fetchNextPage: animesFetchNextPage,
    hasNextPage: animesHasNextPage,
    isFetching: animesIsFetching,
  } = useInfiniteQuery({
    queryKey: ["animes", debouncedSearchInput, genres, status, orderBy],
    queryFn: ({ pageParam }) =>
      getSearchAnime({
        q: debouncedSearchInput,
        page: pageParam,
        limit: 20,
        sfw: true,
        genres: genres.join(","),
        status,
        order_by: orderBy,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (!lastPage.pagination.has_next_page) return undefined;
      return lastPageParam + 1;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const {
    data: genresRes,
    isLoading: genresIsLoading,
    refetch: genresManualRefetch,
  } = useQuery({
    queryKey: ["anime_genres"],
    queryFn: () => getGenresAnime({ filter: "genres" }),
  });

  const animesData = animesRes;
  const genresData = genresRes?.data;

  if (genresIsLoading && !genresData)
    return (
      <div className="text-center">
        <Loader2 className="mx-auto mt-4 mb-1 h-8 w-8 animate-spin" />
        <p>Loading animes...</p>
      </div>
    );

  if (!genresData)
    return (
      <Alert variant="destructive">
        <XCircle />
        <AlertTitle>External API Error!</AlertTitle>
        <AlertDescription>
          Unfortunately this is an error of external API we use to run this
          site. Please wait a while and click button below.
        </AlertDescription>
        <div>
          <Button
            onClick={() => genresManualRefetch()}
            variant="destructive"
            className="mt-3"
          >
            Refresh Animes
          </Button>
        </div>
      </Alert>
    );

  return (
    <main className="container mx-auto max-w-8xl mt-6">
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

        <div className="mt-2">
          <Filters
            items={genresData}
            checkedArray={genres}
            toggle={toggleGenre}
          />
        </div>
      </div>

      {animesData && (
        <div className="mt-6">
          <AnimesGrid data={animesData} />
          <div className="text-center">
            <Button
              className="mt-3 mb-6"
              disabled={!animesHasNextPage}
              onClick={() => animesFetchNextPage()}
            >
              Load More
            </Button>
          </div>
        </div>
      )}

      {/* {animesData ? (
        <div className="mt-6">
          <AnimesGrid data={animesData} />
        </div>
      ) : (
        !animesIsLoading &&
        ((animesRes as JikanAPIErrorType)?.status === 429 ? (
          <Alert variant="destructive">
            <XCircle />
            <AlertTitle>You Reached API Rate Limit!</AlertTitle>
            <AlertDescription>
              Unfortunately this is a rate limit of external API we use to run
              this site. Please wait 1s and click button below.
            </AlertDescription>
            <div>
              <Button
                onClick={() => animesManualRefetch()}
                variant="destructive"
                className="mt-3"
              >
                Refresh Animes
              </Button>
            </div>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <XCircle />
            <AlertTitle>External API Error!</AlertTitle>
            <AlertDescription>
              Unfortunately this is an error of external API we use to run this
              site. Please wait a while and click button below.
            </AlertDescription>
            <div>
              <Button
                onClick={() => animesManualRefetch()}
                variant="destructive"
                className="mt-3"
              >
                Refresh Animes
              </Button>
            </div>
          </Alert>
        ))
      )} */}
    </main>
  );
};

export default AnimesPage;
