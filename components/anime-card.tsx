import Image from "next/image";
import Link from "next/link";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type AnimeCardProps = {
  data: any;
};

const AnimeCard = ({ data }: AnimeCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Link href={`/animes/${data.mal_id}`}>
          <div className="relative w-full aspect-[3/4] group">
            <Image
              priority
              fill
              src={data.images.webp.large_image_url}
              alt="anime_cover"
              className="w-full h-full object-cover z-10 group-hover:filter group-hover:brightness-50 transition"
            />
            <div className="absolute bottom-0 w-full h-[40%] bg-gradient-to-t from-black to-transparent z-20" />
            <p className="absolute w-11/12 bottom-2 left-2 line-clamp-1 z-30">
              {data.titles[0].title}
            </p>
          </div>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" className="min-w-[300px]">
        <p className="mb-2 font-semibold leading-tight">
          {data.titles[0].title}
        </p>
        <p className="text-xs line-clamp-6">{data.synopsis}</p>
      </HoverCardContent>
    </HoverCard>
  );
};
export default AnimeCard;
