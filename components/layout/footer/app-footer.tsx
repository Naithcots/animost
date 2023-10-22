import { Github } from "lucide-react";

const AppFooter = () => {
  return (
    <footer>
      <div className="absolute bottom-0 w-full h-16 py-6 flex justify-center gap-x-1 bg-zinc-200 dark:bg-zinc-800/90">
        <span className="flex items-center">Coded by</span>
        <a
          href="https://github.com/Naithcots"
          className="flex items-center hover:underline"
        >
          <Github className="w-5 h-5" />
          Naithcots
        </a>
      </div>
    </footer>
  );
};
export default AppFooter;
