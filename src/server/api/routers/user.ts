import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
    studentProcedure,
    teacherProcedure,
    clubProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
    get_all_users: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.db.user.findMany({});
        })
});