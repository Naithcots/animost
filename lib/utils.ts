import { clsx, type ClassValue } from "clsx";
import { getServerSession } from "next-auth/next";
import { twMerge } from "tailwind-merge";
import authOptions from "./authOptions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const useServerSession = () => getServerSession(authOptions);
