"use client";
import { FormEvent, ChangeEvent, useState } from "react";
import { xml2json } from "xml-js";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "../ui/use-toast";

const MalFileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xmlFile, setXmlFile] = useState<File | null>(null);

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
      <Button className="mt-3" disabled={!xmlFile || isLoading}>
        {isLoading ? "Importing..." : "Import"}
      </Button>
    </form>
  );
};
export default MalFileForm;
