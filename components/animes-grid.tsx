import { InfiniteData } from "@tanstack/react-query";
import AnimeCard from "./anime-card";

interface AnimesGridProps {
  data: InfiniteData<any>;
}

const AnimesGrid = ({ data }: AnimesGridProps) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {data.pages.map((page) =>
        page.data.map((item: any) => (
          <AnimeCard data={item} key={item.mal_id} />
        ))
      )}
    </div>
  );
};
export default AnimesGrid;
