import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  studentProcedure,
  teacherProcedure,
  clubProcedure,
} from "@/server/api/trpc";

export const blogRouter = createTRPCRouter({
  get_all_blogs: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.blog.findMany({});
    }),

  get_blogs_by_role: publicProcedure
    .input(z.object({ role: z.enum(["STUDENT", "TEACHER", "CLUB"]) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.blog.findMany({ where: { createdBy: { role: input.role } } });
    })
});
