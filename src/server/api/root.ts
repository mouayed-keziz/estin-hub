import { blogRouter } from "@/server/api/routers/blog";
import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";
import { devRouter } from "@/server/api/routers/dev";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  blog: blogRouter,

  dev: devRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
