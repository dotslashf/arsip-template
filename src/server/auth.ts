import { PrismaAdapter } from "@auth/prisma-adapter";
import { type Rank, type UserRole } from "@prisma/client";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import TwitterProvider from "next-auth/providers/twitter";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: UserRole;
      rank: Rank;
      loginProvider?: string;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: UserRole;
    rankId: string;
    rank: Rank;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
const cookiePrefix = process.env.NODE_ENV === "production" ? "__Secure-" : "";
export const authOptions: NextAuthOptions = {
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production" ? true : false,
        domain: "." + "arsiptemplate.app",
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production" ? true : false,
        domain: "." + "arsiptemplate.app",
      },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production" ? true : false,
        maxAge: 900,
        domain: "." + "arsiptemplate.app",
      },
    },
  },
  callbacks: {
    session: async ({ session, user }) => {
      const account = await db.account.findFirst({
        where: {
          userId: user.id,
        },
      });
      const rank = await db.rank.findUnique({
        where: user.rankId
          ? {
              id: user.rankId,
            }
          : {
              minCount: 0,
            },
      });
      if (!user.rankId) {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            rankId: rank?.id,
          },
        });
      }
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
          rank,
          loginProvider: account?.provider,
        },
      };
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */

    TwitterProvider({
      clientId: env.TWITTER_API_KEY,
      clientSecret: env.TWITTER_API_SECRET,
    }),
    Discord({
      clientId: env.DISCORD_API_CLIENT_ID,
      clientSecret: env.DISCORD_API_CLIENT_SECRET,
    }),
    Google({
      clientId: env.GOOGLE_API_CLIENT_ID,
      clientSecret: env.GOOGLE_API_CLIENT_SECRET,
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
