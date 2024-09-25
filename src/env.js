import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    TWITTER_API_KEY: z.string(),
    TWITTER_API_SECRET: z.string(),
    DISCORD_API_CLIENT_ID: z.string(),
    DISCORD_API_CLIENT_SECRET: z.string(),
    GOOGLE_API_CLIENT_ID: z.string(),
    GOOGLE_API_CLIENT_SECRET: z.string(),
    REDIS_HOST_URL: z.string(),
    REDIS_PASSWORD: z.string(),
    GCP_PROJECT_ID: z.string(),
    GOOGLE_APPLICATION_CREDENTIALS: z.string(),
    GCS_BUCKET_NAME: z.string(),
    CRON_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    TWITTER_API_KEY: process.env.TWITTER_API_KEY,
    TWITTER_API_SECRET: process.env.TWITTER_API_SECRET,
    DISCORD_API_CLIENT_ID: process.env.DISCORD_API_CLIENT_ID,
    DISCORD_API_CLIENT_SECRET: process.env.DISCORD_API_CLIENT_SECRET,
    GOOGLE_API_CLIENT_ID: process.env.GOOGLE_API_CLIENT_ID,
    GOOGLE_API_CLIENT_SECRET: process.env.GOOGLE_API_CLIENT_SECRET,
    REDIS_HOST_URL: process.env.REDIS_HOST_URL,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
    GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME,
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    CRON_SECRET: process.env.CRON_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
