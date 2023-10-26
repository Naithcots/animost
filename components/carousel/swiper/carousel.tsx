import { Badge } from "@/components/ui/badge";
import { Anime } from "@/types";
import { useState } from "react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

const SlideContent = ({
  item,
  swiperProps,
}: {
  item: Anime;
  swiperProps: any;
}) => {
  const swiper = useSwiper();

  return (
    <img
      src={item.images.webp.large_image_url}
      className={`${
        (swiperProps.isPrev || swiperProps.isNext) && "scale-[85%]"
      } transition-all duration-500 select-none w-full`}
      onClick={() => {
        if (swiperProps.isPrev) swiper.slidePrev();
        if (swiperProps.isNext) swiper.slideNext();
      }}
    />
  );
};

const Carousel = ({ items }: { items: Anime[] }) => {
  const [activeItem, setActiveItem] = useState(items[0]);

  return (
    <div className="grid grid-cols-[30%,_1fr] md:grid-cols-2">
      <div className="hidden md:block">
        <Swiper
          loop
          slidesPerView={3}
          spaceBetween={10}
          centeredSlides
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          onSlideChange={(swiper) => setActiveItem(items[swiper.realIndex])}
          modules={[Autoplay]}
        >
          {items.map((item) => (
            <SwiperSlide key={item.mal_id}>
              {(swiperProps) => (
                <SlideContent item={item} swiperProps={swiperProps} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="md:hidden">
        <Swiper
          loop
          slidesPerView={1}
          spaceBetween={0}
          autoplay={{
            delay: 5000,
            disableOnInteraction: true,
          }}
          onSlideChange={(swiper) => setActiveItem(items[swiper.realIndex])}
          modules={[Autoplay]}
        >
          {items.map((item) => (
            <SwiperSlide key={item.mal_id}>
              {(swiperProps) => (
                <SlideContent item={item} swiperProps={swiperProps} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="pl-7 flex flex-col">
        <h3 className="text-md sm:text-2xl font-bold mb-1">
          {activeItem.titles[0].title}
        </h3>
        <p className="line-clamp-5 text-justify text-sm sm:text-lg leading-tight sm:leading-tight opacity-90">
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
    </div>
  );
};
export default Carousel;
