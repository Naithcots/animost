"use client";
import useModal from "@/app/hooks/use-modal";
import getLibraryEntry from "@/lib/queries/getLibraryEntry";
import { cn } from "@/lib/utils";
import { Anime } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";

type AnimePageButtonProps = {
  anime: Anime;
};

const AnimePageButton = ({ anime }: AnimePageButtonProps) => {
  const { open } = useModal();

  const { data: libraryEntry } = useQuery({
    queryKey: ["library", { animeId: anime.mal_id }],
    queryFn: () => getLibraryEntry({ jikanMediaId: anime.mal_id.toString() }),
  });

  const handleClick = () => {
    if (libraryEntry) {
      open("editAnimeLibraryJikan", { anime, library: libraryEntry });
    } else {
      open("createAnimeLibrary", { anime });
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        libraryEntry ? "bg-orange-500 hover:bg-orange-600" : "bg-primary",
      )}
    >
      {libraryEntry ? "Edit Library" : "Add to Library"}
    </Button>
  );
};
export default AnimePageButton;
