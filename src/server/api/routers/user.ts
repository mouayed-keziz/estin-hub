
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod"

export const userRouter = createTRPCRouter({
    get_user_by_id: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = await ctx.db.user.findFirst({
                where: { id: input.id },
                include: { blogs: true, comments: true, saved_blogs: { include: { author: true } } }
            })
            if (user) {
                return {
                    message: "success",
                    user: {
                        id: user.id,
                        name: user.name,
                        bio: user.bio,
                        level: user.level,
                        role: user.role,
                        image: user.image,
                        createdAt: user.createdAt,
                        blogs: user.blogs.map(blog => {
                            return {
                                id: blog.id,
                                title: blog.title,
                                image: blog.image,
                                author: user.name,
                                author_id: blog.createdById,
                                role: user.role,
                            }
                        }),
                        saved_blogs: user.saved_blogs.map(blog => {
                            return {
                                id: blog.id,
                                title: blog.title,
                                image: blog.image,
                                author: blog.author.name,
                                role: blog.author.role,
                                author_id: blog.createdById,
                            }
                        }),
                        num_blogs: user.blogs.length,
                        num_saved_blogs: user.saved_blogs.length,
                        num_comments: user.comments.length,
                    }
                }
            } else {
                return {
                    message: 'failed',
                    user: null,
                }
            }
        }),


    get_user_data_only: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = await ctx.db.user.findFirst({
                where: { id: input.id }
            })
            if (user) {
                return ({ message: "success", user: user })
            } else {
                return ({ message: "failed", user: null });
            }
        }),

    update_bio_and_level: protectedProcedure
        .input(z.object({ bio: z.string(), level: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.update({
                where: { id: ctx.session.user.id },
                data: { bio: input.bio, level: input.level }
            })
            if (user) {
                return ({ message: "success", user: user })
            } else {
                return ({ message: "failed", user: null });
            }
        })
});