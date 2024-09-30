import { type Rank, type UserRole } from "@prisma/client";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";

import { env } from "~/env";
import { db } from "~/server/db";
import { getUserRank } from "./util/db";
import PrismaAdapterExtend from "./util/adapter";
import resend from "./util/resend";
import WelcomeEmail from "~/app/_components/Email/Welcoming";

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
      avatarSeed: string | null;
      username: string | null;
      loginProvider?: string;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: UserRole;
    rankId: string;
    rank: Rank;
    avatarSeed: string;
    username: string;
    engagementScore: number;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
const cookiePrefix = process.env.NODE_ENV === "production" ? "__Secure-" : "";
const domain =
  process.env.NODE_ENV === "production" ? "arsiptemplate.app" : "localhost";
const secure = process.env.NODE_ENV === "production" ? true : false;
export const authOptions: NextAuthOptions = {
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure,
        domain: "." + domain,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure,
        domain: "." + domain,
      },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure,
        maxAge: 900,
        domain: "." + domain,
      },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure,
        maxAge: 900,
        domain: "." + domain,
      },
    },
    nonce: {
      name: `${cookiePrefix}next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure,
        domain: "." + domain,
      },
    },
  },
  callbacks: {
    session: async ({ session, user }) => {
      const account = await db.account.findFirst({
        where: {
          userId: user.id,
        },
        select: {
          provider: true,
        },
      });
      // send welcoming email
      if (!user.emailVerified) {
        await Promise.all([
          resend.emails.send({
            from: "Arsip Template <noreply@arsiptemplate.app>",
            to: user.email,
            subject: "Selamat datang di arsip template!",
            react: WelcomeEmail({
              name: user.name ?? user.email,
              previewText: "Selamat datang di arsip template!",
            }),
          }),
          db.user.update({
            where: {
              id: user.id,
            },
            data: {
              emailVerified: new Date(),
            },
          }),
        ]);
      }
      if (!user.avatarSeed) {
        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            avatarSeed: user.id,
            username: user.id.slice(0, 15),
          },
        });
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
          avatarSeed: user.avatarSeed,
          username: user.username,
          loginProvider: account?.provider,
          rank: await getUserRank(db.rank, user.engagementScore),
        },
      };
    },
  },
  adapter: PrismaAdapterExtend(db),
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
