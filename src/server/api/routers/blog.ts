import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { type Blog } from "@prisma/client";

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
      const blog = await ctx.db.blog.findFirst({ where: { id: input.id } });
      if (blog) {

        const author = await ctx.db.user.findFirst({ where: { id: blog.createdById } });
        const comments = await ctx.db.comment.findMany({ where: { blogId: blog.id }, include: { createdBy: true }, orderBy: { createdAt: "desc" } });
        const related_blogs: Blog[] = await ctx.db.blog.findMany({ where: { createdById: blog.createdById, id: { not: blog.id } }, take: 3, orderBy: { createdAt: "desc" } });


        if (author) return { message: "success", blog, author, comments, related_blogs }
        else return { message: "failed", blog: null, author: null }
      }
      else return { message: "failed", blog: null, author: null }
    }),


  get_blog_by_id2: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const blog = await ctx.db.blog.findFirst({ where: { id: input.id } });
      if (blog) {
        const author = await ctx.db.user.findFirst({ where: { id: blog.createdById } });
        if (author) {
          const related_blogs: Blog[] = await ctx.db.blog.findMany({ where: { createdById: blog.createdById, id: { not: blog.id } }, take: 3, orderBy: { createdAt: "desc" } });
          return { message: "success", blog, author, related_blogs }
        } else return { message: "failed", blog: null, author: null, related_blogs: null }
      } else return { message: "failed", blog: null, author: null, related_blogs: null }
    }),

  get_blog_comments: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.db.comment.findMany({ where: { blogId: input.id }, include: { createdBy: true }, orderBy: { createdAt: "desc" } });
      return comments
    }),

  // -----------------------------------------------------------------------------------------------

  create_comment: protectedProcedure
    .input(z.object({ comment: z.string(), blogId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.comment.create({
        data: {
          content: input.comment,
          blog: { connect: { id: input.blogId } },
          createdBy: { connect: { id: ctx.session.user.id } }
        }
      })
    }),
});
