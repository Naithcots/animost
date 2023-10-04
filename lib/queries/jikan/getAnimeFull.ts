import { Anime } from "@/types";

type GetAnimeFullParams = {
  id: number;
};

export default async function getAnimeFull({
  id,
}: GetAnimeFullParams): Promise<{ data: Anime }> {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
  return await response.json();
}
