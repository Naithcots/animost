import db from "@/lib/db";
import { Anime } from "@/types";
import {
  AnimeStatus,
  AnimeType,
  LibraryStatus,
  MediaType,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { useServerSession } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await useServerSession();
    const jikanMediaId = req.nextUrl.searchParams.get("jikanMediaId");

    if (!session?.user)
      return new NextResponse("Unauthorized", { status: 401 });

    if (!jikanMediaId)
      return new NextResponse("Missing `jikanMediaId`", { status: 400 });

    const libraryEntry = await db.library.findFirst({
      where: {
        user: {
          googleId: session.user.id,
        },
        LibraryAnime: {
          jikanMediaId: jikanMediaId.toString(),
        },
      },
    });

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

    // await db.$transaction(
    //   anime.genres.map((genre) =>
    //     db.genre.upsert({
    //       where: {
    //         mal_id: genre.mal_id.toString(),
    //       },
    //       create: {
    //         mal_id: genre.mal_id.toString(),
    //         name: genre.name,
    //         type: genre.type,
    //         url: genre.url,
    //       },
    //       update: {},
    //     })
    //   )
    // );

    const libraryEntry = await db.library.create({
      data: {
        user: {
          connect: {
            googleId: session.user.id,
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