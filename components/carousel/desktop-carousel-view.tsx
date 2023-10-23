import { Anime } from "@/types";
import { Badge } from "../ui/badge";

type DesktopCarouselViewProps = {
  items: Anime[];
  previousIdx: number;
  nextIdx: number;
  activeIdx: number;
  activeItem: Anime;
  onPrev: () => void;
  onNext: () => void;
};

const DesktopCarouselView = ({
  items,
  previousIdx,
  nextIdx,
  activeIdx,
  activeItem,
  onPrev,
  onNext,
}: DesktopCarouselViewProps) => {
  const x = `${activeIdx * 15}vw`;
  const xGap = `${activeIdx * 16}px`;

  return (
    <section className="hidden md:grid grid-cols-[calc(45vw+2*16px),_1fr] overflow-hidden">
      <div className="overflow-hidden">
        <div
          className={`flex gap-[16px] transition-all duration-500`}
          style={{
            transform: `translateX(-${x}) translateX(-${xGap})`,
          }}
        >
          <div
            className={`w-[15vw] shrink-0 transition-all duration-500 cursor-pointer ${
              items.length - 1 === previousIdx && "scale-[80%]"
            }`}
            onClick={() => {
              items.length - 1 === previousIdx && onPrev();
            }}
            key={"last"}
          >
            <img
              src={items[items.length - 1].images.webp.large_image_url}
              className="h-full rounded-sm object-cover"
            />
          </div>
          {items.map((item, idx) => (
            <div
              className={`w-[15vw] shrink-0 transition-all duration-500 ${
                (idx === nextIdx || idx === previousIdx) &&
                "scale-[80%] cursor-pointer"
              }`}
              onClick={() => {
                idx === nextIdx ? onNext() : idx === previousIdx && onPrev();
              }}
              key={item.mal_id}
            >
              <img
                src={item.images.webp.large_image_url}
                className="h-full rounded-sm object-cover"
              />
            </div>
          ))}
          <div
            className={`w-[15vw] shrink-0 transition-all duration-500 ${
              0 === nextIdx && "scale-[80%] cursor-pointer"
            }`}
            onClick={() => {
              0 === nextIdx && onNext();
            }}
            key={"first"}
          >
            <img
              src={items[0].images.webp.large_image_url}
              className="h-full rounded-sm object-cover"
            />
          </div>
        </div>
      </div>
      <div className="px-4 flex flex-col">
        <h3 className="text-2xl font-semibold mb-2">
          {activeItem.titles[0].title}
        </h3>
        <p className="line-clamp-4 text-justify opacity-90">
          {activeItem.synopsis}
        </p>
        <div className="mt-4 flex gap-2">
          {activeItem.genres.map((genre) => (
            <Badge key={genre.mal_id}>{genre.name}</Badge>
          ))}
        </div>
      </div>
    </section>
  );
};
export default DesktopCarouselView;
