"use client";
import { MALImportFile } from "@/types";
import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import socket from "socket.io-client";
import { xml2json } from "xml-js";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { toast } from "../ui/use-toast";

const MalFileForm = () => {
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [processed, setProcessed] = useState<number | null>(null);
  const [totalToProcess, setTotalToProcess] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const io = socket(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });
    io.on("import_progress", (processed) => {
      // console.log(data);
      setProcessed(processed);
    });
  }, []);

  const onFileChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    if (files?.length) {
      setXmlFile(files[0]);
    }
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setIsLoading(true);
    setError(null);

    const xmlText = await xmlFile!.text();

    const json = xml2json(xmlText, { compact: true });
    // console.log(json);
    const totalAmount = (JSON.parse(json) as MALImportFile).myanimelist.anime
      .length;
    setProcessed(0);
    setTotalToProcess(totalAmount);

    try {
      const res = await axios.post("/api/import", json);
      setIsLoading(false);
      console.log(res.data);
      toast({ title: "Library succesfully imported!" });
    } catch (error: any) {
      setIsLoading(false);
      setError("An error occured during import, no changes made in library.");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="file"
        accept=".xml"
        multiple={false}
        onChange={onFileChange}
        className="block mt-1"
        disabled={isLoading}
      />
      {error && <p className="text-red-500">{error}</p>}
      {isLoading && (
        <Progress
          value={(processed! / totalToProcess!) * 100}
          className="mt-4 mb-1 md:w-[40%]"
        />
      )}
      <Button className="mt-3" disabled={!xmlFile || isLoading}>
        {isLoading ? "Importing..." : "Import"}
      </Button>
    </form>
  );
};
export default MalFileForm;