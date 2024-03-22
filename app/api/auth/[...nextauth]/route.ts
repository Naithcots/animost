import authOptions from "@/lib/authOptions";
import { Session, User } from "next-auth";
import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    dbId?: string;
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
