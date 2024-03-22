import db from "@/lib/db";
import { useServerSession } from "@/lib/utils";
import { Anime } from "@/types";
import {
  AnimeStatus,
  AnimeType,
  LibraryStatus,
  MediaType,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET all authorized user library entries
// Optional searchParams:
// GET (url)?mediaId=? - GET authorized user single library entry
export async function GET(req: NextRequest) {
  try {
    const session = await useServerSession();
    const searchParams = req.nextUrl.searchParams;
    const mediaId = searchParams.get("mediaId");

    if (!session?.user)
      return new NextResponse("Unauthorized", { status: 401 });

    let libraryEntry;

    if (mediaId) {
      libraryEntry = await db.library.findFirst({
        where: {
          userId: session.user.id,
          mediaId,
        },
      });
    } else {
      libraryEntry = await db.library.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          LibraryAnime: true,
        },
      });
    }

    return NextResponse.json(libraryEntry);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await useServerSession();
    const {
      library,
      anime,
    }: {
      library: { status: LibraryStatus; episodes?: number; score?: number };
      anime: Anime;
    } = await req.json();

    if (!session?.user)
      return new NextResponse("Unauthorized", { status: 401 });

    if (!library || !anime)
      return new NextResponse("Missing variables", { status: 400 });

    const animeStatusMap = {
      "Finished Airing": AnimeStatus.FINISHED,
      "Currently Airing": AnimeStatus.AIRING,
      "Not yet aired": AnimeStatus.PLANNED,
    };

    const animeTypeMap = {
      Movie: AnimeType.MOVIE,
      Music: AnimeType.MUSIC,
      ONA: AnimeType.ONA,
      OVA: AnimeType.OVA,
      Special: AnimeType.SPECIAL,
      TV: AnimeType.TV,
    };

    const image =
      anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;

    const libraryEntry = await db.library.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        status: library.status,
        episodes: library.episodes,
        score: library.score,
        type: MediaType.ANIME,
        LibraryAnime: {
          connectOrCreate: {
            where: {
              jikanMediaId: anime.mal_id.toString(),
            },
            create: {
              image,
              jikanMediaId: anime.mal_id.toString(),
              status: animeStatusMap[anime.status],
              title: anime.titles[0].title,
              type: animeTypeMap[anime.type],
              Genres: {
                connectOrCreate: anime.genres.map((genre) => ({
                  where: {
                    mal_id: genre.mal_id.toString(),
                  },
                  create: {
                    mal_id: genre.mal_id.toString(),
                    name: genre.name,
                    type: genre.type,
                    url: genre.url,
                  },
                })),
              },
            },
          },
        },
      },
    });

    return NextResponse.json(libraryEntry);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
