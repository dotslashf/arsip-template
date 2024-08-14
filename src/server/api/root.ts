import {
  createCallerFactory,
  createTRPCRouter,
  // publicProcedure,
} from "~/server/api/trpc";
import { copyPastaRouter } from "./routers/copyPasta";
import { tagRouter } from "./routers/tag";
import { dashboardRouter } from "./routers/dashboard";
import { rankingRouter } from "./routers/ranking";
import { reactionRouter } from "./routers/reaction";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  copyPasta: copyPastaRouter,
  tag: tagRouter,
  dashboard: dashboardRouter,
  ranking: rankingRouter,
  reaction: reactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
