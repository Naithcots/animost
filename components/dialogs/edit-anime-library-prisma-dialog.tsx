"use client";
import useModal from "@/app/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import getAnimeFull from "@/lib/queries/jikan/getAnimeFullById";
import { zodResolver } from "@hookform/resolvers/zod";
import { LibraryAnime, LibraryStatus } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";

const EditAnimeLibraryPrismaDialog = () => {
  const [isReady, setIsReady] = useState(false);
  const [isEpisodesDisabled, setIsEpisodesDisabled] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { data, isOpen, type, close } = useModal();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const anime = data.anime as LibraryAnime;
  const { library } = data;

  const open = isOpen && type === "editAnimeLibraryPrisma";

  const {
    data: jikanData,
    isLoading: jikanIsLoading,
    isError: jikanIsError,
  } = useQuery({
    queryKey: ["anime", { animeId: anime?.jikanMediaId }],
    queryFn: () => getAnimeFull(anime.jikanMediaId),
    enabled: !!anime && open,
  });

  const formSchema = z.object({
    status: z.nativeEnum(LibraryStatus),
    episodes: z.coerce
      .number()
      .min(0)
      .max(jikanData?.episodes || 9999, {
        message: jikanData?.episodes
          ? `This anime aired with ${jikanData?.episodes} episodes.`
          : "Is that even possible?",
      }),
    score: z.coerce.number().min(0).max(100).nullable().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: library?.status || LibraryStatus.PLANNING,
      episodes: library?.episodes || 0,
      score: library?.score || null,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleClose = () => {
    close();
    setTimeout(() => form.reset(), 200);
  };

  const onRemove = async () => {
    try {
      setIsRemoving(true);
      await axios.delete(`/api/library/${library!.id}`);
      await queryClient.invalidateQueries({
        queryKey: ["library"],
      });
      router.refresh();
      handleClose();
      toast({
        title: "Success!",
        description: `${
          jikanData!.titles[0].title
        } succesfully removed from library.`,
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      close();
      toast({
        title: "Error... Please try again later!",
        description: "There was an error while removing from library.",
        variant: "destructive",
        duration: 3500,
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/library/${library?.id}`, {
        ...values,
        mediaId: jikanData!.mal_id,
      });
      await queryClient.invalidateQueries({
        queryKey: ["library"],
      });
      router.refresh();
      handleClose();
      toast({
        title: "Success!",
        description: `${jikanData!.titles[0].title} succesfully updated.`,
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      close();
      toast({
        title: "Error... Please try again later!",
        description: "There was an error while updating library entry.",
        variant: "destructive",
        duration: 3500,
      });
    }
  };

  useEffect(() => {
    const { unsubscribe } = form.watch((value) => {
      if (value.status === "COMPLETED") {
        setIsEpisodesDisabled(true);
        if (value.episodes !== jikanData?.episodes!) {
          form.setValue("episodes", jikanData?.episodes!);
        }
      } else {
        setIsEpisodesDisabled(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [form.watch, jikanData]);

  useEffect(() => {
    setIsReady(false);
    if (library?.status) form.setValue("status", library.status);
    if (library?.score) form.setValue("score", library.score);
    if (library?.episodes) form.setValue("episodes", library.episodes);
    setIsReady(true);
  }, [anime, library, jikanData]);

  if (!anime || !library || !jikanData || !isReady) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Anime in Library</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-3"
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting || isRemoving}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={LibraryStatus.PLANNING}>
                        Planning
                      </SelectItem>
                      {jikanData?.status !== "Not yet aired" && (
                        <>
                          <SelectItem value={LibraryStatus.WATCHING}>
                            Watching
                          </SelectItem>
                          {jikanData?.status === "Finished Airing" && (
                            <SelectItem value={LibraryStatus.COMPLETED}>
                              Completed
                            </SelectItem>
                          )}
                          <SelectItem value={LibraryStatus.PAUSED}>
                            Paused
                          </SelectItem>
                          <SelectItem value={LibraryStatus.DROPPED}>
                            Dropped
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {jikanData?.status !== "Not yet aired" && (
              <FormField
                control={form.control}
                name="episodes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Episodes Watched</FormLabel>
                    <div className="relative">
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        disabled={
                          isSubmitting || isEpisodesDisabled || isRemoving
                        }
                      />
                      {jikanData?.episodes && (
                        <span className="absolute bottom-0 right-3 top-0 flex h-full select-none items-center text-zinc-600">
                          /{jikanData?.episodes}
                        </span>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {jikanData?.status !== "Not yet aired" && (
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score</FormLabel>
                    <Input
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Leave empty if no score"
                      disabled={isSubmitting || isRemoving}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="mt-2 flex justify-end gap-x-4">
              <Button
                type="button"
                className="w-28 bg-red-500 hover:bg-red-600"
                disabled={isSubmitting || isRemoving}
                onClick={onRemove}
              >
                Remove
              </Button>
              <Button
                type="submit"
                className="w-32"
                disabled={isSubmitting || isRemoving}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default EditAnimeLibraryPrismaDialog;
