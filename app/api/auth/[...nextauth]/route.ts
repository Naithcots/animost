import db from "@/lib/db";
import { AuthOptions, DefaultSession } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      try {
        const userExist = await db.user.findUnique({
          where: {
            googleId: user.id,
          },
        });

        if (!userExist) {
          await db.user.create({
            data: {
              googleId: user.id,
              email: user.email!,
              username: user.name!,
              avatarUrl: user.image,
            },
          });
        }

        return true;
      } catch (error) {
        console.log("next-auth Error - signIn: ", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
export const useServerSession = () => getServerSession(authOptions);
