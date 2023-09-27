import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import db from "@/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
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
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
