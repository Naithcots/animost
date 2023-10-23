"use client";

import { Anime } from "@/types";
import { useState } from "react";
import DesktopCarouselView from "./desktop-carousel-view";
import MobileCarouselView from "./mobile-carousel-view";

const Carousel = ({ items }: { items: Anime[] }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeItem = items[activeIdx];
  const previousIdx = activeIdx === 0 ? items.length - 1 : activeIdx - 1;
  const nextIdx = activeIdx === items.length - 1 ? 0 : activeIdx + 1;

  const onPrev = () => setActiveIdx(previousIdx);
  const onNext = () => setActiveIdx(nextIdx);

  return (
    <div className="mb-4">
      <MobileCarouselView
        {...{
          activeIdx,
          activeItem,
          items,
          nextIdx,
          previousIdx,
          onNext,
          onPrev,
        }}
      />
      <DesktopCarouselView
        {...{
          activeIdx,
          activeItem,
          items,
          nextIdx,
          previousIdx,
          onPrev,
          onNext,
        }}
      />

      {/* {activeIdx}
      <button className="mr-4" onClick={onPrev}>
        Prev
      </button>
      <button onClick={onNext}>Next</button> */}
    </div>
  );
};
export default Carousel;
