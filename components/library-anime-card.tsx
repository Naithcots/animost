"use client";
import Image from "next/image";
import Link from "next/link";

import useModal from "@/app/hooks/use-modal";
import { LibraryWithLibraryAnime } from "@/types";
import { Edit } from "lucide-react";

type LibraryAnimeCardProps = {
  data: LibraryWithLibraryAnime;
};

const LibraryAnimeCard = ({ data }: LibraryAnimeCardProps) => {
  const { open } = useModal();
  const anime = data.LibraryAnime;

  return (
    <div className="relative w-full aspect-[3/4] group">
      <Image
        fill
        sizes="25vw"
        src={anime.image}
        alt="anime_cover"
        className="w-full h-full object-cover rounded-sm z-10 group-hover:filter group-hover:brightness-50 transition"
      />
      <div className="absolute bottom-0 w-full h-[40%] rounded-b-sm bg-gradient-to-t from-black to-transparent z-20" />
      <Link href={`/animes/${anime.jikanMediaId}`}>
        <p className="absolute w-11/12 bottom-2 left-2 text-sm text-white line-clamp-1 z-30">
          {anime.title}
        </p>
      </Link>
      <button
        className="w-fit h-fit top-2 right-2 lg:w-0 lg:h-0 overflow-hidden lg:-translate-y-5 lg:group-hover:w-fit lg:group-hover:h-fit lg:group-hover:translate-y-0 absolute shadow-md hover:bg-yellow-500/70 bg-yellow-500 rounded-full transition z-40"
        onClick={() =>
          open("editAnimeLibraryPrisma", {
            anime,
            library: data,
          })
        }
      >
        <Edit className="w-6 h-6 m-2" />
      </button>
    </div>
  );
};
export default LibraryAnimeCard;
