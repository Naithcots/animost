"use client";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { signIn, signOut, useSession } from "next-auth/react";
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
    <header className="container max-w-8xl px-4 flex items-center justify-between sm:justify-normal py-3 gap-x-4 z-100">
      <Link href={"/"}>
        <span className="text-xl font-semibold">AniMost</span>
      </Link>
      <div className="hidden sm:flex flex-1 ml-8">
        <NavigationMenu />
      </div>
      {user && (
        <div className="hidden ml-auto md:block">
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
              <DropdownMenuContent className="dark:bg-zinc-800 dark:border-zinc-950">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-zinc-700" />
                <DropdownMenuItem className="dark:hover:bg-zinc-700">
                  <Link href="/profile" onClick={() => setOpen(false)}>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="dark:hover:bg-zinc-700">
                  <Link
                    href="/library"
                    onClick={() => setOpen(false)}
                    prefetch={false}
                  >
                    Library
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="dark:hover:bg-zinc-700">
                  <button onClick={() => signOut()}>Sign Out</button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signIn("google")}>Sign In</Button>
          ))}
        <ThemeToggle />
      </div>
    </header>
  );
};
export default AppHeader;
