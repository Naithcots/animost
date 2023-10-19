"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const ErrorHome = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div>
      <Alert variant="destructive">
        <XCircle />
        <AlertTitle>Couldn't load collection..</AlertTitle>
        <AlertDescription>
          Unfortunately this is an internal error of external API we use to run
          this site.
        </AlertDescription>
        <div>
          <Button onClick={reset} variant="destructive" className="mt-3">
            Refresh Site
          </Button>
        </div>
      </Alert>
    </div>
  );
};
export default ErrorHome;
