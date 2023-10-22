import { Github } from "lucide-react";

const AppFooter = () => {
  return (
    <footer>
      <div className="py-6 flex justify-center gap-x-1 bg-zinc-800/90">
        <span className="inline-flex">Coded by</span>
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
