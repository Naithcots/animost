import { Anime } from "@/types";

const getAnimeFullById = async (id: string | number) => {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);

  if (!response.ok) throw new Error("Anime not found");

  const wrappedData = (await response.json()) as { data: Anime };
  return wrappedData.data;
};

export default getAnimeFullById;
