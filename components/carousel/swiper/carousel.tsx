import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Anime } from "@/types";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";

const SlideContent = ({ item }: { item: Anime }) => {
  const swiper = useSwiper();
  const slide = useSwiperSlide();

  return (
    <Image
      src={item.images.webp.large_image_url}
      width={600}
      height={800}
      alt="cover image"
      className={cn(
        "aspect-[3/4] w-full select-none object-cover object-center transition-transform duration-500",
        slide.isActive ? "scale-[100%]" : "scale-[80%]",
      )}
      onClick={() => {
        if (slide.isPrev) swiper.slidePrev();
        if (slide.isNext) swiper.slideNext();
      }}
    />
  );
};

const Carousel = ({ items }: { items: Anime[] }) => {
  const [activeItem, setActiveItem] = useState(items[0]);

  return (
    <div className="xs:grid-cols-[30%,_1fr] grid grid-cols-[85px_1fr] md:grid-cols-2">
      <div className="">
        <Swiper
          loop
          slidesPerView={1}
          spaceBetween={10}
          centeredSlides
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          onSlideChange={(swiper) => setActiveItem(items[swiper.realIndex])}
          modules={[Autoplay]}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
          }}
        >
          {items.map((item, idx) => (
            <SwiperSlide key={idx}>
              <SlideContent item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="xs:pl-6 flex flex-col pl-4">
        <h3 className="xs:text-lg xs:line-clamp-1 mb-2 line-clamp-2 break-all font-bold hover:underline sm:text-2xl">
          <Link href={`/animes/${activeItem.mal_id}`}>
            {activeItem.titles[0].title}
          </Link>
        </h3>
        <Separator className="mb-3" />
        <div className="xs:flex-row gap xs:text-lg flex flex-col gap-x-4 gap-y-1">
          <p className="w-fit rounded-md bg-primary px-2 py-1 text-sm font-semibold">
            # {activeItem.rank || "?"}
          </p>
          <p className="flex items-center gap-[2px]">
            <Star className="h-3 w-3" />
            {activeItem.score}
          </p>
        </div>
        <div className="xs:flex mt-4 hidden flex-wrap gap-2">
          {activeItem.genres.slice(0, 3).map((genre) => (
            <Badge variant="secondary" key={genre.mal_id}>
              <span className="text-[0.675rem]">{genre.name}</span>
            </Badge>
          ))}
        </div>
        <p className="xs:text-base mt-3 hidden text-sm leading-tight text-muted-foreground lg:line-clamp-3 lg:text-lg">
          {activeItem.synopsis}
        </p>
        <Button asChild className="mt-3 hidden w-fit xl:block">
          <Link href={`/animes/${activeItem.mal_id}`}>Read More...</Link>
        </Button>
      </div>
    </div>
  );
};

export default Carousel;
