"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type AnimePageErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

const AnimePageError = ({ error, reset }: AnimePageErrorProps) => {
  return (
    <div>
      <Alert variant="destructive">
        <AlertTitle>Anime not found..</AlertTitle>
        <AlertDescription>
          You can try to refresh this page by clicking button below.
        </AlertDescription>
        <Button onClick={() => reset()} className="mt-3">Retry</Button>
      </Alert>
    </div>
  );
};
export default AnimePageError;
