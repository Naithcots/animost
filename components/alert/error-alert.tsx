import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const ErrorAlert = ({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) => {
  return (
    <Alert variant="destructive">
      <XCircle />
      <AlertTitle>{title}Couldn{"'"}t load collection..</AlertTitle>
      <AlertDescription>
        {description}
        Unfortunately this is an internal error of external API we use to run
        this site.
      </AlertDescription>
      <div>
        <Button
          onClick={() => onClick()}
          variant="destructive"
          className="mt-3"
        >
          Refresh Site
        </Button>
      </div>
    </Alert>
  );
};
export default ErrorAlert;
