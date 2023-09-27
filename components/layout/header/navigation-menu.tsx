import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenu as RadixNavigationMenu,
} from "@/components/ui/navigation-menu";

const NavigationMenu = () => {
  return (
    <RadixNavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 dark:data-[active]:bg-zinc-800 dark:data-[state=open]:bg-zinc-800">
            Anime
          </NavigationMenuTrigger>
          <NavigationMenuContent className="dark:bg-zinc-800">
            <div className="grid grid-cols-[.75fr_1fr] p-3 gap-y-2">
              <NavigationMenuLink asChild className="row-span-3">
                <a
                  href="/"
                  className="relative h-full w-[120px] mr-3 rounded-md bg-gray-600"
                >
                  <span className="absolute bottom-2 w-full text-center text-lg font-semibold">
                    Top Anime
                  </span>
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  href="/"
                  className="px-6 py-2 text-center font-semibold rounded-md transition dark:hover:bg-zinc-600 dark:bg-zinc-700"
                >
                  Trending
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  href="/"
                  className="px-6 py-2 text-center font-semibold rounded-md transition dark:hover:bg-zinc-600 dark:bg-zinc-700"
                >
                  Seasons
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  href="/"
                  className="px-6 py-2 text-center font-semibold rounded-md transition dark:hover:bg-zinc-600 dark:bg-zinc-700"
                >
                  Tags
                </a>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 dark:data-[active]:bg-zinc-800 dark:data-[state=open]:bg-zinc-800">
            Manga
          </NavigationMenuTrigger>
          <NavigationMenuContent className="dark:bg-zinc-800">
            <div className="grid grid-cols-[.75fr_1fr] p-3 gap-y-2">
              <NavigationMenuLink asChild className="row-span-3">
                <a
                  href="/"
                  className="relative h-full w-[120px] mr-3 rounded-md bg-gray-600"
                >
                  <span className="absolute bottom-2 w-full text-center text-lg font-semibold">
                    Top Reads
                  </span>
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  href="/"
                  className="px-6 py-2 text-center font-semibold rounded-md transition dark:hover:bg-zinc-600 dark:bg-zinc-700"
                >
                  Trending
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  href="/"
                  className="px-6 py-2 text-center font-semibold rounded-md transition dark:hover:bg-zinc-600 dark:bg-zinc-700"
                >
                  Releases
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  href="/"
                  className="px-6 py-2 text-center font-semibold rounded-md transition dark:hover:bg-zinc-600 dark:bg-zinc-700"
                >
                  Tags
                </a>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 dark:data-[active]:bg-zinc-800 dark:data-[state=open]:bg-zinc-800">
            Community
          </NavigationMenuTrigger>
          <NavigationMenuContent className="dark:bg-zinc-800">
            <div className="flex gap-x-3 p-3">
              <NavigationMenuLink asChild>
                <a
                  href="/"
                  className="px-6 py-2 text-center font-semibold rounded-md min-w-[120px] transition dark:hover:bg-zinc-600 dark:bg-zinc-700"
                >
                  Search
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  href="/"
                  className="px-6 py-2 text-center font-semibold rounded-md min-w-[120px] transition dark:hover:bg-zinc-600 dark:bg-zinc-700"
                >
                  Active
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  href="/"
                  className="px-6 py-2 text-center font-semibold rounded-md min-w-[120px] transition dark:hover:bg-zinc-600 dark:bg-zinc-700"
                >
                  Recents
                </a>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </RadixNavigationMenu>
  );
};
export default NavigationMenu;
