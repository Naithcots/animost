"use client";
import useModal from "@/app/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Anime } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LibraryStatus } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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

const AddAnimeLibraryDialog = () => {
  const [isEpisodesDisabled, setIsEpisodesDisabled] = useState(false);
  const { data, isOpen, type, close } = useModal();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const open = isOpen && type === "createAnimeLibrary";
  const anime = data?.anime as Anime;

  const formSchema = z.object({
    status: z.nativeEnum(LibraryStatus).default("PLANNING"),
    episodes: z.coerce
      .number()
      .min(0)
      .max(anime?.episodes || 9999, {
        message: anime?.episodes
          ? `This anime aired with ${anime?.episodes} episodes.`
          : "Is that even possible?",
      })
      .default(0),
    score: z.coerce.number().min(0).max(100).nullable().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: LibraryStatus.PLANNING,
      episodes: 0,
      score: null,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleClose = () => {
    close();
    setTimeout(() => form.reset(), 200);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/library", {
        library: values,
        anime,
      });
      await queryClient.invalidateQueries({
        queryKey: ["library"],
      });
      handleClose();
      toast({
        title: "Success",
        description: `${anime?.titles[0].title} added to your library.`,
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      close();
      toast({
        title: "Error... Please try again later!",
        description: "There was an error while creating library entry.",
        variant: "destructive",
        duration: 3500,
      });
    }
  };

  useEffect(() => {
    const { unsubscribe } = form.watch((value) => {
      if (value.status === "COMPLETED") {
        setIsEpisodesDisabled(true);
        if (value.episodes !== anime?.episodes!) {
          form.setValue("episodes", anime?.episodes!);
        }
      } else {
        setIsEpisodesDisabled(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [form, form.watch, anime]);

  if (!anime) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Anime to Library</DialogTitle>
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
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
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
                      {anime?.status !== "Not yet aired" && (
                        <>
                          <SelectItem value={LibraryStatus.WATCHING}>
                            Watching
                          </SelectItem>
                          {anime?.status === "Finished Airing" && (
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
            {anime?.status !== "Not yet aired" && (
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
                        disabled={isSubmitting || isEpisodesDisabled}
                      />
                      {anime?.episodes && (
                        <span className="absolute bottom-0 right-3 top-0 flex h-full select-none items-center text-zinc-600">
                          /{anime.episodes}
                        </span>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {anime?.status !== "Not yet aired" && (
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
                      disabled={isSubmitting}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button
              type="submit"
              className="ml-auto mt-2 w-32"
              disabled={isSubmitting}
            >
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default AddAnimeLibraryDialog;
