import AddAnimeLibraryDialog from "../dialogs/add-anime-library-dialog";
import EditAnimeLibraryJikanDialog from "../dialogs/edit-anime-library-jikan-dialog";
import EditAnimeLibraryPrismaDialog from "../dialogs/edit-anime-library-prisma-dialog";

const ModalProvider = () => {
  return (
    <>
      <AddAnimeLibraryDialog />
      <EditAnimeLibraryJikanDialog />
      <EditAnimeLibraryPrismaDialog />
    </>
  );
};
export default ModalProvider;
