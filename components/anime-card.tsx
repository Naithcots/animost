"use client";
import Image from "next/image";
import Link from "next/link";

import useModal from "@/app/hooks/use-modal";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Anime } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Edit, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import getLibraryEntry from "@/lib/queries/getLibraryEntry";

type AnimeCardProps = {
  data: Anime;
};

const AnimeCard = ({ data }: AnimeCardProps) => {
  const { status, data: userData } = useSession();
  const { open } = useModal();

  const { data: libraryData, isLoading: libraryIsLoading } = useQuery(
    ["library", { userId: userData?.user.id, animeId: data.mal_id }],
    () => getLibraryEntry({ jikanMediaId: data.mal_id.toString() }),
    {
      enabled: status === "authenticated",
    }
  );

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {/* <Link href={`/animes/${data.mal_id}`}> */}
        <div className="relative w-full aspect-[3/4] group">
          <Image
            priority
            fill
            sizes="25vw"
            src={data.images.webp.large_image_url}
            alt="anime_cover"
            className="w-full h-full object-cover rounded-sm z-10 group-hover:filter group-hover:brightness-50 transition"
          />
          <div className="absolute bottom-0 w-full h-[40%] rounded-b-sm bg-gradient-to-t from-black to-transparent z-20" />
          <Link href={`/animes/${data.mal_id}`}>
            <p className="absolute w-11/12 bottom-2 left-2 text-sm text-white line-clamp-1 z-30">
              {data.titles[0].title}
            </p>
          </Link>
          {status === "authenticated" && !libraryIsLoading && (
            <>
              {libraryData ? (
                <button
                  className="w-fit h-fit top-2 right-2 lg:w-0 lg:h-0 overflow-hidden lg:-translate-y-5 lg:group-hover:w-fit lg:group-hover:h-fit lg:group-hover:translate-y-0 absolute shadow-md hover:bg-yellow-500/70 bg-yellow-500 rounded-full transition z-40"
                  onClick={() =>
                    open("editAnimeLibraryJikan", {
                      anime: data,
                      library: libraryData,
                    })
                  }
                >
                  <Edit className="w-6 h-6 m-2" />
                </button>
              ) : (
                <button
                  className="w-fit h-fit top-2 right-2 lg:w-0 lg:h-0 overflow-hidden lg:-translate-y-5 lg:group-hover:w-fit lg:group-hover:h-fit lg:group-hover:translate-y-0 absolute shadow-md hover:bg-green-600/70 bg-green-600 rounded-full transition z-40"
                  onClick={() => open("createAnimeLibrary", { anime: data })}
                >
                  <Plus className="w-7 h-7 m-1" />
                </button>
              )}
            </>
          )}
        </div>
        {/* </Link> */}
      </HoverCardTrigger>
      <HoverCardContent side="bottom" className="min-w-[300px]">
        <Link href={`/animes/${data.mal_id}`}>
          <p className="mb-2 font-semibold leading-tight hover:underline">
            {data.titles[0].title}
          </p>
        </Link>
        <p className="text-xs line-clamp-6">{data.synopsis}</p>
      </HoverCardContent>
    </HoverCard>
  );
};
export default AnimeCard;
