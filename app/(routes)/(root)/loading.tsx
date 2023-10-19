import { Loader2 } from "lucide-react";

const LoadingHome = () => {
  return (
    <div className="text-center">
      <Loader2 className="mx-auto mt-4 mb-1 h-8 w-8 animate-spin" />
      <p>Loading collection...</p>
    </div>
  );
};
export default LoadingHome;
