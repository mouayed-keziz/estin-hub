
import {
    createTRPCRouter,
    publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
    get_all_users: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.db.user.findMany({});
        })
});