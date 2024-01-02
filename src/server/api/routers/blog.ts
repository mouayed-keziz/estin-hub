import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { type Blog } from "@prisma/client";
import { backendClient } from "@/lib/edgestore-server";
import { title } from "process";

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
      tags: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const new_blog = await ctx.db.blog.create({
        data: {
          title: input.title,
          image: input.image,
          tags: input.tags,
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

      // const blog = await ctx.db.blog.delete({
      //   where: {
      //     id: input.id,
      //     author: { id: ctx.session.user.id }
      //   },
      // });
      //delete blog with id = input.id, with all its comments and saves and ratings
      const blog = await ctx.db.blog.findFirst({ where: { id: input.id } });
      if (blog) {
        await ctx.db.comment.deleteMany({ where: { blogId: input.id } });
        await ctx.db.blog_rating.deleteMany({ where: { blogId: input.id } });
        await ctx.db.blog.delete({ where: { id: input.id } });
        await backendClient.publicFiles.deleteFile({ url: blog.image })
        return blog
      }
      else throw new Error("Failed to delete blog")
    }),


  // -----------------------------------------------------------------------------------------------



  get_blog_by_id: publicProcedure
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

  // -----------------------------------------------------------------------------------------------

  like_blog: protectedProcedure
    .input(z.object({ blogId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id
        },
        data: {
          saved_blogs: { connect: { id: input.blogId } }
        }
      })
    }),

  // -----------------------------------------------------------------------------------------------

  unlike_blog: protectedProcedure
    .input(z.object({ blogId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id
        },
        data: {
          saved_blogs: { disconnect: { id: input.blogId } }
        }
      })
    }),

  // -----------------------------------------------------------------------------------------------

  get_blog_stats: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const blog = await ctx.db.blog.findFirst({
        where: { id: input.id }, select: { saved_by: true, comments: true, blog_rating: true, createdById: true }
      });
      if (blog) {
        const comments: number = blog.comments.length
        const saves: number = blog.saved_by.length;
        const rating_length: number = blog.blog_rating.length
        if (rating_length === 0) return { comments, avg_rating: 0, saves, authorId: blog.createdById }
        else {
          let sum = 0;
          blog.blog_rating.forEach(rating => {
            if (rating.rating !== null) {
              sum += rating.rating;
            }
          });

          const avg_rating = sum / rating_length;
          return { comments, avg_rating, saves, authorId: blog.createdById }
        }
      }
    }),

  // -----------------------------------------------------------------------------------------------

  get_my_rating_for_blog: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const rating = await ctx.db.blog_rating.findFirst({ where: { blogId: input.id, userId: ctx.session.user.id } });
      if (rating) return rating.rating ?? 0
      else return 0
    }),

  // -----------------------------------------------------------------------------------------------

  get_my_like_for_blog: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // check if the blog is saved by ctx.session.user.id
      const blog = await ctx.db.blog.findFirst({ where: { id: input.id, saved_by: { some: { id: ctx.session.user.id } } } });
      if (blog) return true
      else return false
    }),

  // -----------------------------------------------------------------------------------------------

  rate_blog: protectedProcedure
    .input(z.object({ blogId: z.string(), rating: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existingRating = await ctx.db.blog_rating.findFirst({ where: { blogId: input.blogId, userId: ctx.session.user.id } });

      if (existingRating) {
        await ctx.db.blog_rating.update({
          where: { id: existingRating.id },
          data: { rating: input.rating }
        });
      } else {
        await ctx.db.blog_rating.create({
          data: {
            blog: { connect: { id: input.blogId } },
            user: { connect: { id: ctx.session.user.id } },
            rating: input.rating
          }
        });
      }

      const ratings = await ctx.db.blog_rating.findMany({ where: { blogId: input.blogId } });
      let sum = 0;
      ratings.forEach(rating => {
        if (rating.rating !== null) {
          sum += rating.rating;
        }
      });
      const avg = sum / ratings.length;
      await ctx.db.blog.update({ where: { id: input.blogId }, data: { rating: avg } });
    }),


  // -----------------------------------------------------------------------------------------------


  search_blogs: publicProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const blogs = await ctx.db.blog.findMany({
        where: {
          OR: [
            { title: { contains: input.query } },
            { tags: { contains: input.query } },
            { content: { contains: input.query } },
            { author: { name: { contains: input.query } } },
          ]
        },
        include: {
          author: true
        }
      })
      return blogs;
    }),

  // -----------------------------------------------------------------------------------------------

  home_page_blogs: publicProcedure
    .query(async ({ ctx }) => {
      const result = await ctx.db.$transaction([
        ctx.db.blog.findMany({ where: { author: { role: { equals: "STUDENT" } } }, take: 3, orderBy: { createdAt: "desc" }, include: { author: { select: { name: true, role: true } } } }),
        ctx.db.blog.findMany({ where: { author: { role: { equals: "TEACHER" } } }, take: 3, orderBy: { createdAt: "desc" }, include: { author: { select: { name: true, role: true } } } }),
        ctx.db.blog.findMany({ where: { author: { role: { equals: "CLUB" } } }, take: 3, orderBy: { createdAt: "desc" }, include: { author: { select: { name: true, role: true } } } }),
        ctx.db.blog.findMany({ take: 3, orderBy: { createdAt: "desc" }, include: { author: { select: { name: true, role: true } } } })
      ]);

      const student_blogs = result[0].map(blog => (
        {
          author: {
            name: blog.author.name,
            role: blog.author.role
          },
          id: blog.id,
          title: blog.title,
          image: blog.image,
          content: blog.content,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          createdById: blog.createdById,
          tags: blog.tags,
          rating: blog.rating,
        }
      ))
      const teacher_blogs = result[1].map(blog => (
        {
          author: {
            name: blog.author.name,
            role: blog.author.role
          },
          id: blog.id,
          title: blog.title,
          image: blog.image,
          content: blog.content,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          createdById: blog.createdById,
          tags: blog.tags,
          rating: blog.rating,
        }
      ))
      const club_blogs = result[2].map(blog => (
        {
          author: {
            name: blog.author.name,
            role: blog.author.role
          },
          id: blog.id,
          title: blog.title,
          image: blog.image,
          content: blog.content,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          createdById: blog.createdById,
          tags: blog.tags,
          rating: blog.rating,
        }
      ))
      const recent_blogs = result[3].map(blog => (
        {
          author: {
            name: blog.author.name,
            role: blog.author.role
          },
          id: blog.id,
          title: blog.title,
          image: blog.image,
          content: blog.content,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          createdById: blog.createdById,
          tags: blog.tags,
          rating: blog.rating,
        }
      ))

      return {
        student_blogs,
        teacher_blogs,
        club_blogs,
        recent_blogs
      }
    })
});
