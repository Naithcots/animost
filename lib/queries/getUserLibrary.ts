import { LibraryWithLibraryAnime } from "@/types";

const getUserLibrary = async (): Promise<LibraryWithLibraryAnime[]> => {
  const response = await fetch("/api/library");
  if (!response.ok) throw new Error();
  return await response.json();
};

export default getUserLibrary;
