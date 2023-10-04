import AnimeCard from "./anime-card";

interface AnimesGridProps {
  data: any;
}

const AnimesGrid = ({ data }: AnimesGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {data.data.map((item: any) => (
        <AnimeCard data={item} key={item.mal_id} />
      ))}
    </div>
  );
};
export default AnimesGrid;
