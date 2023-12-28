import { blogRouter } from "@/server/api/routers/blog";
import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";
import { devRouter } from "@/server/api/routers/dev";


export const appRouter = createTRPCRouter({
  user: userRouter,
  blog: blogRouter,

  dev: devRouter
});

export type AppRouter = typeof appRouter;
