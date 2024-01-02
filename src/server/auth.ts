import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import { db } from "@/server/db";


declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "STUDENT" | "TEACHER" | "CLUB";
    } & DefaultSession["user"];
  }

}


export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: user
    }),
    // signIn: ({ user }) => {
    //   return Boolean(user.email?.endsWith("@estin.dz"))
    // }
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
