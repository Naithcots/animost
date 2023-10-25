import prisma from "@/lib/db";
import getAnimeFull from "@/lib/queries/jikan/getAnimeFull";
import { Anime, MALImportFile, MALUserAnimeStatus } from "@/types";
import {
  AnimeStatus,
  AnimeType,
  LibraryStatus,
  MediaType,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { useServerSession } from "../auth/[...nextauth]/route";
import axios from "axios";

const TIMEOUT_MS = 1000;

const animeStatusMap = {
  "Finished Airing": AnimeStatus.FINISHED,
  "Currently Airing": AnimeStatus.AIRING,
  "Not yet aired": AnimeStatus.PLANNED,
};

const libraryStatusMap = {
  Completed: LibraryStatus.COMPLETED,
  Watching: LibraryStatus.WATCHING,
  "Plan to Watch": LibraryStatus.PLANNING,
  "On-Hold": LibraryStatus.PAUSED,
  Dropped: LibraryStatus.DROPPED,
};

const animeTypeMap = {
  Movie: AnimeType.MOVIE,
  Music: AnimeType.MUSIC,
  ONA: AnimeType.ONA,
  OVA: AnimeType.OVA,
  Special: AnimeType.SPECIAL,
  TV: AnimeType.TV,
};

const sleep = () => new Promise((res, rej) => setTimeout(res, TIMEOUT_MS));

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const session = await useServerSession();

    if (!session?.user)
      return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findFirst({
      where: {
        googleId: session.user.id,
      },
    });

    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const list = (await req.json()) as MALImportFile;

    if (!list) return new NextResponse("Missing body", { status: 400 });

    // console.log(list);
    const animeList = list.myanimelist.anime.map((anime) => ({
      id: anime.series_animedb_id._text,
      episodes: anime.my_watched_episodes._text,
      rating: anime.my_score._text,
      status: anime.my_status._text as MALUserAnimeStatus,
    }));

    let transactions = [];
    let processed = 0;

    for (const anime of animeList) {
      //   console.log(anime);

      //   Add anime to LibraryAnime if not exist
      const animeExist = await prisma.libraryAnime.findFirst({
        where: {
          jikanMediaId: anime.id,
        },
      });
      if (!animeExist) {
        let jikanAnime: Anime | null = null;

        await sleep();
        jikanAnime = (await getAnimeFull({ id: Number(anime.id) })).data;

        // console.log("Jikan: ", jikanAnime);

        transactions.push(
          prisma.libraryAnime.create({
            data: {
              image:
                jikanAnime!.images?.webp?.large_image_url ||
                jikanAnime!.images?.jpg?.large_image_url,
              jikanMediaId: jikanAnime!.mal_id.toString(),
              status: animeStatusMap[jikanAnime!.status],
              title: jikanAnime!.titles[0].title,
              type: animeTypeMap[jikanAnime!.type],
              Genres: {
                connectOrCreate: jikanAnime!.genres.map((genre) => ({
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
          })
        );

        // LibraryAnime now exist, add new Library entry
        // transactions.push(
        //   prisma.library.create({
        //     data: {
        //       userId: user.id,
        //       mediaId: jikanAnime!.mal_id.toString(),
        //       type: MediaType.ANIME,
        //       episodes: Number(anime.episodes) || null,
        //       score: anime.rating ? Number(anime.rating) * 10 : null,
        //       status: libraryStatusMap[anime.status],
        //     },
        //   })
        // );
      } else {
        // Anime exists, check if user have library entry for anime
        const libraryEntry = await prisma.library.findFirst({
          where: {
            user: {
              googleId: session.user.id,
            },
            mediaId: animeExist.jikanMediaId,
          },
        });

        if (libraryEntry) {
          // In library, delete record to override
          transactions.push(
            prisma.library.delete({
              where: {
                id: libraryEntry.id,
              },
            })
          );

          //   Add new record
          //   transactions.push(
          //     prisma.library.create({
          //       data: {
          //         userId: user.id,
          //         mediaId: anime.id,
          //         type: MediaType.ANIME,
          //         episodes: Number(anime.episodes) || null,
          //         score: anime.rating ? Number(anime.rating) * 10 : null,
          //         status: libraryStatusMap[anime.status],
          //       },
          //     })
          //   );
        } else {
          // Not in library, add new record
          //   transactions.push(
          //     prisma.library.create({
          //       data: {
          //         userId: user.id,
          //         mediaId: anime.id,
          //         type: MediaType.ANIME,
          //         episodes: Number(anime.episodes) || null,
          //         score: anime.rating ? Number(anime.rating) * 10 : null,
          //         status: libraryStatusMap[anime.status],
          //       },
          //     })
          //   );
        }
      }
      transactions.push(
        prisma.library.create({
          data: {
            userId: user.id,
            mediaId: anime.id,
            type: MediaType.ANIME,
            episodes: Number(anime.episodes) || null,
            score: anime.rating ? Number(anime.rating) * 10 : null,
            status: libraryStatusMap[anime.status],
          },
        })
      );

      processed++;
      await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/emitimport?processed=${processed}`);
    }

    const importRes = await prisma.$transaction(transactions);
    // console.log(importRes);

    return NextResponse.json(importRes);
  } catch (error: any) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
