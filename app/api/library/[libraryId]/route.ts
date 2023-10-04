import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { useServerSession } from "../../auth/[...nextauth]/route";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { libraryId: string } }
) {
  try {
    const session = await useServerSession();
    const values = await req.json();
    const libraryId = params.libraryId;

    if (!session?.user)
      return new NextResponse("Unauthorized", { status: 401 });
    if (!libraryId)
      return new NextResponse("Missing `libraryId` param", { status: 400 });
    if (!values)
      return new NextResponse("Missing `values` body", { status: 400 });

    const libraryEntry = await db.library.update({
      where: {
        id: libraryId,
        mediaId: values.mediaId.toString(),
        user: {
          googleId: session.user.id,
        },
      },
      data: {
        episodes: values.episodes,
        score: values.score,
        status: values.status,
      },
    });

    return NextResponse.json(libraryEntry);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { libraryId: string } }
) {
  try {
    const session = await useServerSession();
    const libraryId = params.libraryId;

    if (!session?.user)
      return new NextResponse("Unauthorized", { status: 401 });
    if (!libraryId)
      return new NextResponse("Missing `libraryId` param", { status: 400 });

    const libraryEntry = await db.library.delete({
      where: {
        id: libraryId,
        user: {
          googleId: session.user.id,
        },
      },
    });

    return NextResponse.json(libraryEntry);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
