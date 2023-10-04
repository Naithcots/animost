"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface FiltersProps {
  items: any;
  checkedArray: number[];
  toggle: (a: number) => void;
}

const Filters = ({ items, checkedArray, toggle }: FiltersProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          Genres
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ScrollArea className="h-[300px]">
          {items.data.map((item: any) => (
            <DropdownMenuCheckboxItem
              key={item.mal_id}
              checked={checkedArray.includes(item.mal_id)}
              onClick={() => toggle(item.mal_id)}
            >
              {item.name}
            </DropdownMenuCheckboxItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default Filters;
