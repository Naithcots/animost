"use client";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import ThemeToggle from "../../theme-toggle";
import NavigationMenu from "./navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const AppHeader = () => {
  const { data, status } = useSession();
  const [open, setOpen] = useState(false);
  const user = data?.user;

  return (
    <header className="max-w-8xl z-100 container flex items-center justify-between gap-x-4 px-4 py-3 sm:justify-normal">
      <Link href={"/"}>
        <span className="text-xl font-semibold">AniMost</span>
      </Link>
      <div className="ml-8 hidden flex-1 sm:flex">
        <NavigationMenu />
      </div>
      {user && (
        <div className="ml-auto hidden md:block">
          <Link href={"/library"}>
            <Button>Library</Button>
          </Link>
        </div>
      )}
      <div className="flex items-center gap-x-3">
        {status !== "loading" &&
          (user ? (
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger>
                <UserAvatar src={user?.image || null} username={user.name!} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dark:border-zinc-950 dark:bg-zinc-800">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-zinc-700" />
                {/* <DropdownMenuItem className="dark:hover:bg-zinc-700" asChild>
                  <Link href="/profile" onClick={() => setOpen(false)}>
                    Profile
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem className="dark:hover:bg-zinc-700" asChild>
                  <Link
                    href="/library"
                    onClick={() => setOpen(false)}
                    prefetch={false}
                  >
                    Library
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="dark:hover:bg-zinc-700" asChild>
                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    prefetch={false}
                  >
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="dark:hover:bg-zinc-700"
                  onClick={() => signOut()}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href={"/sign-in"}>Sign In</Link>
            </Button>
          ))}
        <ThemeToggle />
      </div>
    </header>
  );
};
export default AppHeader;
