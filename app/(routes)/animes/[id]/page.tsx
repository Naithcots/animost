import AnimePageButton from "@/components/anime-page/button";
import Synopsis from "@/components/anime-page/synopsis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import getAnimeFullById from "@/lib/queries/jikan/getAnimeFullById";
import { cn, useServerSession } from "@/lib/utils";
import { Music, Star, Tv } from "lucide-react";
import Image from "next/image";

type AnimePageProps = {
  params: {
    id: string;
  };
};

const AnimePage = async ({ params: { id } }: AnimePageProps) => {
  const session = await useServerSession();
  const data = await getAnimeFullById(id);

  const details = (
    <div>
      <div>
        <p className="-mb-[5px] line-clamp-1 text-xl font-bold md:text-2xl">
          {data.titles[0].title}
        </p>
        {data?.titles[3] && (
          <p className="line-clamp-1 text-muted-foreground">
            {data.titles[3].title}
          </p>
        )}
      </div>
      <Badge variant="outline" className="mb-3 mt-2 gap-1 text-base">
        {data.type === "Music" ? (
          <Music className="h-4 w-4" />
        ) : (
          <Tv className="h-4 w-4" />
        )}
        {data.type}
      </Badge>
      <div className="flex flex-wrap gap-2">
        {data.genres.map(({ mal_id, name }) => (
          <Badge key={mal_id}>{name}</Badge>
        ))}
      </div>
    </div>
  );

  const stats = (
    <div>
      <div className="flex items-center gap-3">
        <p
          className={cn(
            "w-fit rounded-lg bg-secondary px-3 py-[2px] text-lg font-semibold text-secondary-foreground",
            data?.rank < 1000 && "bg-amber-800",
            data?.rank < 500 && "bg-gray-500",
            data?.rank < 100 && "bg-yellow-500",
            data?.rank === 1 && "bg-yellow-500",
            data?.rank === 2 && "bg-gray-500",
            data?.rank === 3 && "bg-amber-800",
            !data?.rank && "bg-secondary",
          )}
        >
          # {data?.rank || "?"}
        </p>
        <p className="flex items-center gap-[1px] text-xl font-semibold">
          <Star className="h-4 w-4" />
          {data?.score || "?"}
        </p>
      </div>

      <p className="font-semibold">{data?.status || "Status Unknown"}</p>
      <p>Episodes: {data?.episodes || "-"}</p>
      <p>
        {(data?.season &&
          data?.year &&
          `${data.season.toUpperCase()} ${data.year}`) ||
          "Season Unknown"}
      </p>
      <div className="mt-3">
        {session?.user ? (
          <AnimePageButton anime={data} />
        ) : (
          <Button disabled>Add To List</Button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="xs:grid-cols-2 grid items-end gap-6 md:grid-cols-[auto_1fr] md:items-start">
        <Image
          src={data.images.webp.large_image_url}
          alt="background"
          width={250}
          height={600}
          className="mx-auto w-auto shadow-sm"
          priority
        />

        <div className="sm:hidden">{stats}</div>
        <div className="hidden sm:block">
          {details}
          <div className="my-6" />
          {stats}
        </div>
      </div>

      <div className="mt-3 sm:hidden">{details}</div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:gap-12 ">
        <Synopsis text={data.synopsis} />

        <div className="h-fit rounded-sm bg-secondary p-3">
          <p className="font-semibold">
            Duration: <span className="font-normal">{data.duration}</span>
          </p>
          <p className="font-semibold">
            Aired from:{" "}
            <span className="font-normal">
              {data.aired.from
                ? new Date(data.aired.from).toLocaleDateString()
                : "-"}
            </span>
          </p>
          <p className="font-semibold">
            Aired to:{" "}
            <span className="font-normal">
              {data.aired.to
                ? new Date(data.aired.to).toLocaleDateString()
                : "-"}
            </span>
          </p>
          <p className="font-semibold">
            Broadcast:{" "}
            <span className="font-normal">{data.broadcast?.string || "-"}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default AnimePage;
