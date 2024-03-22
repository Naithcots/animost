"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

type SynopsisProps = {
  text: string;
};

const Synopsis = ({ text }: SynopsisProps) => {
  const previewLength = 500;
  const [expanded, setExpanded] = useState(false);
  const previewText = text.substring(0, previewLength);

  const toggleExpanded = () => setExpanded(!expanded);

  if (text.length <= previewLength)
    return (
      <div>
        <p className="text-justify">{text}</p>
      </div>
    );

  return (
    <div>
      <p className="text-justify">
        {expanded ? text : previewText}
        <span className={cn(expanded && "hidden")}>...</span>
        <span
          onClick={toggleExpanded}
          className="cursor-pointer font-semibold underline"
        >
          {expanded ? " Read less..." : " Read more..."}
        </span>
      </p>
    </div>
  );
};
export default Synopsis;
