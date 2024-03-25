"use client";
import socket from "@/lib/socket";
import { MALImportFile } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { xml2json } from "xml-js";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { toast } from "../ui/use-toast";

const MalFileForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [processed, setProcessed] = useState<number | null>(null);
  const [totalToProcess, setTotalToProcess] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    const onConnect = () => {
      setSocketConnected(true);
    };

    const onImportProgress = (data: { current: number; total: number }) => {
      setProcessed(data.current);
      setTotalToProcess(data.total);
    };

    const onImportSuccess = (data: { success: number; total: number }) => {
      setIsLoading(false);

      if (data.success === data.total) {
        toast({
          title: "Import successful!",
          description: "Your list should now appear in library.",
        });
      } else {
        toast({
          title: `Import partially successful. ${((data.success / data.total) * 100).toFixed(2)}`,
          description:
            "Your list should now appear in library. Try to import again later to get all entries",
        });
      }
    };

    const onImportFailed = () => {
      setIsLoading(false);
      setError("An error occured..");
      toast({
        title: "Import failed...",
        description: "Please try again later.",
        variant: "destructive",
      });
    };

    if (session.status === "loading") return;
    if (session.status === "unauthenticated") {
      router.push("/");
      return;
    }

    socket.connect();
    socket.on("connect", onConnect);
    socket.on("mal-import:progress", onImportProgress);
    socket.on("mal-import:success", onImportSuccess);
    socket.on("mal-import:failed", onImportFailed);

    return () => {
      if (socket.connected) socket.disconnect();
      socket.off("connect", onConnect);
      socket.off("mal-import:progress", onImportProgress);
      socket.off("mal-import:success", onImportSuccess);
      socket.off("mal-import:failed", onImportFailed);
    };
  }, [session]);

  const onFileChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    if (files?.length) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setIsLoading(true);
    setError(null);

    const xmlText = await file!.text();

    const json = xml2json(xmlText, { compact: true });
    const totalAmount = (JSON.parse(json) as MALImportFile).myanimelist.anime
      .length;
    setProcessed(0);
    setTotalToProcess(totalAmount);

    console.log(JSON.parse(json));

    if (!socket) {
      toast({
        title: "Import service unavailable!",
        description: "Please try again later..",
      });
      setIsLoading(false);
      setError("Import service unavailable!");
      return;
    }

    socket.emit("mal-import:init", {
      file: json,
      userId: session.data!.user.id,
    });

    // await importMalList();

    // try {
    //   await axios.post("/api/import", json);
    //   setIsLoading(false);
    //   toast({ title: "Library succesfully imported!" });
    // } catch (error: any) {
    //   setIsLoading(false);
    //   setError("An error occured during import, no changes made in library.");
    // }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="file"
        accept=".xml"
        multiple={false}
        onChange={onFileChange}
        className="mt-1 block"
        disabled={isLoading}
      />
      {error && <p className="text-red-500">{error}</p>}
      {processed && totalToProcess && isLoading && (
        <Progress
          value={(processed / totalToProcess) * 100}
          className="mb-1 mt-4 md:w-[40%]"
        />
      )}
      <Button
        className="mt-3"
        disabled={!file || isLoading || !socketConnected}
        type="submit"
      >
        {isLoading ? "Importing..." : "Import"}
      </Button>
    </form>
  );
};
export default MalFileForm;
