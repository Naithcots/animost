import db from "@/lib/db";
import { UserAccountType } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthOptions, DefaultSession, User } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) return null;

        try {
          const user = await db.user.findUnique({
            where: {
              email: credentials.email,
              type: UserAccountType.CREDENTIALS,
            },
          });

          if (!user) return null;

          const passwordMatches = await bcrypt.compare(
            credentials.password,
            user.password!
          );

          if (passwordMatches) {
            const sessionUser: User = {
              id: user.id,
              email: user.email,
              name: user.username,
            };
            return sessionUser;
          } else {
            return null;
          }
        } catch (error: any) {
          console.log("next-auth Error - credentials authorize: ", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !user.name) return false;
      if (account?.provider === "credentials") return true;

      try {
        const dbUser = await db.user.findUnique({
          where: {
            email: user.email,
          },
        });

        if (!dbUser) {
          if (account?.provider === "google") {
            await db.user.create({
              data: {
                googleId: account.providerAccountId,
                email: user.email,
                username: user.name,
                avatarUrl: user.image,
                type: UserAccountType.GOOGLE_OAUTH,
              },
            });
          } else return false;
        } else {
          if (account?.provider === "google" && !dbUser.googleId) {
            await db.user.update({
              where: { email: user.email },
              data: {
                googleId: account.providerAccountId,
              },
            });
          }
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
export const {} = handler;
export { handler as GET, handler as POST, authOptions };
export const useServerSession = () => getServerSession(authOptions);
