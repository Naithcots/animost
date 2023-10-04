import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenu as RadixNavigationMenu,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

const NavigationMenu = () => {
  return (
    <RadixNavigationMenu className="z-50">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 dark:data-[active]:bg-zinc-800 dark:data-[state=open]:bg-zinc-800"
            )}
          >
            <Link href={"/animes"}>Anime</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 dark:data-[active]:bg-zinc-800 dark:data-[state=open]:bg-zinc-800"
            )}
          >
            <Link href={"/mangas"}>Manga</Link>
          </NavigationMenuLink>
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
