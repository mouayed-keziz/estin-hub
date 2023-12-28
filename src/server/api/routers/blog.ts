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

  // -----------------------------------------------------------------------------------------------

  get_blogs_by_role: publicProcedure
    .input(z.object({ role: z.enum(["STUDENT", "TEACHER", "CLUB"]) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.blog.findMany({
        where: { author: { role: { equals: input.role } } },
        select: { title: true, image: true, author: { select: { name: true, role: true } } }
      });
    }),

  // -----------------------------------------------------------------------------------------------

  create_new_blog: protectedProcedure
    .input(z.object({
      title: z.string(),
      image: z.string(),
      content: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      console.log("hello worldf")
      const new_blog = await ctx.db.blog.create({
        data: {
          title: input.title,
          image: input.image,
          content: input.content,
          author: { connect: { id: ctx.session.user.id } }
        }
      })
      return new_blog;
    }),

  // -----------------------------------------------------------------------------------------------

  delete_blog: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log("hell oworld")
      const blog = await ctx.db.blog.delete({ where: { id: input.id, author: { id: ctx.session.user.id } } });

      if (blog) return blog
      else throw new Error("Failed to delete blog")
    }),

  // -----------------------------------------------------------------------------------------------

  publish_blog: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const blog = await ctx.db.blog.update({ where: { id: input.id, author: { id: ctx.session.user.id } }, data: { status: "PUBLISHED" } });

      if (blog) return blog
      else throw new Error("Failed to publish blog")
    }),

  // -----------------------------------------------------------------------------------------------

  get_blog_by_id: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.blog.findFirst({ where: { id: input.id } });
    }),
});
