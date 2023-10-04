import { Anime } from "@/types";
import { Library, LibraryAnime } from "@prisma/client";
import { create } from "zustand";

type ModalTypes =
  | "createAnimeLibrary"
  | "editAnimeLibraryJikan"
  | "editAnimeLibraryPrisma"
  | null;
type ModalData = { anime?: Anime | LibraryAnime; library?: Library };

type UseModalType = {
  type: ModalTypes;
  isOpen: boolean;
  data: ModalData;
  open: (type: ModalTypes, data: ModalData) => void;
  close: () => void;
};

const useModal = create<UseModalType>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  open: (type: ModalTypes, data: ModalData) =>
    set({ type, isOpen: true, data }),
  close: () => set({ isOpen: false, type: null, data: { ...{} } }),
}));

export default useModal;
