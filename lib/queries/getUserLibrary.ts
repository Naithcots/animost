import { LibraryWithLibraryAnime } from "@/types";

const getUserLibrary = async (): Promise<LibraryWithLibraryAnime[]> => {
  const res = await fetch("/api/library");
  const data = await res.json();
  return data;
};

export default getUserLibrary;
