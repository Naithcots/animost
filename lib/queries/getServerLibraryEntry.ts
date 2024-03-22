import { useServerSession } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";

type GetLibraryEntryParams = {
  jikanMediaId: string;
};

export default async function getServerLibraryEntry({
  jikanMediaId,
}: GetLibraryEntryParams) {
  const session = await useServerSession();

  const data = await db.library.findFirst({
    where: {
      mediaId: jikanMediaId,
      userId: session?.user.id,
    },
  });

  return data;
}
