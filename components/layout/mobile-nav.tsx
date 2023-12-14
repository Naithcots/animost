"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);

  // Element that keeps button on bottom of the page
  const hiddenOverlay = (
    <div className="sm:hidden fixed top-0 left-0 inset-0 h-screen w-full invisible"></div>
  );

  return (
    <>
      {hiddenOverlay}
      <button
        className="sm:hidden fixed bottom-3 ml-auto right-3 p-3 w-fit h-fit bg-card rounded-full shadow-lg cursor-pointer hover:bg-secondary/95 transition z-50"
        onClick={() => setOpen((open) => !open)}
      >
        <Menu />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <div className="my-3 flex flex-col gap-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2 opacity-80">
                Categories
              </h3>
              <div className="flex flex-col gap-y-2 ml-3">
                <Link href={"/animes"} className="text-2xl" onClick={onClose}>
                  Anime
                </Link>
                <Link href={"/mangas"} className="text-2xl" onClick={onClose}>
                  Manga
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 opacity-80">
                Community
              </h3>
              <div className="flex flex-col gap-y-2 ml-3">
                <Link href={"/"} className="text-2xl" onClick={onClose}>
                  Search
                </Link>
                <Link href={"/"} className="text-2xl" onClick={onClose}>
                  Active
                </Link>
                <Link href={"/"} className="text-2xl" onClick={onClose}>
                  Recents
                </Link>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
export default MobileNav;
