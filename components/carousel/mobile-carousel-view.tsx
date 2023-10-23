import { Anime } from "@/types";
import { Badge } from "../ui/badge";
import { useEffect } from "react";

// Time between slides in ms:
const INTERVAL = 4000;

type MobileCarouselViewProps = {
  items: Anime[];
  previousIdx: number;
  nextIdx: number;
  activeIdx: number;
  activeItem: Anime;
  onPrev: () => void;
  onNext: () => void;
};

const MobileCarouselView = ({
  items,
  previousIdx,
  nextIdx,
  activeIdx,
  activeItem,
  onPrev,
  onNext,
}: MobileCarouselViewProps) => {
  const x = `${activeIdx * 30}vw`;
  const xGap = `${activeIdx * 16}px`;

  useEffect(() => {
    const interval = setInterval(() => {
      onNext();
    }, INTERVAL);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <section className="grid md:hidden grid-cols-[30vw,_1fr] overflow-hidden">
      <div className="overflow-hidden">
        <div
          className={`flex gap-[16px] transition-all duration-500`}
          style={{
            transform: `translateX(-${x}) translateX(-${xGap})`,
          }}
        >
          {items.map((item, idx) => (
            <div
              className={`w-full shrink-0 transition-all duration-500 ${
                (idx === nextIdx || idx === previousIdx) && "scale-[80%]"
              }`}
              key={item.mal_id}
            >
              <img
                src={item.images.webp.large_image_url}
                className="h-full rounded-sm object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="pl-4 flex flex-col">
        <h3 className="text-md sm:text-2xl font-bold mb-1">{activeItem.titles[0].title}</h3>
        <p className="line-clamp-5 text-justify text-sm sm:text-lg opacity-90">
          {activeItem.synopsis}
        </p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {activeItem.genres.slice(0, 3).map((genre) => (
            <Badge key={genre.mal_id}>
              <span className="text-[0.675rem]">{genre.name}</span>
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
};
export default MobileCarouselView;
