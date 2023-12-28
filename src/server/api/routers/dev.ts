import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
    studentProcedure,
    teacherProcedure,
    clubProcedure,
} from "@/server/api/trpc";

export const devRouter = createTRPCRouter({
    hello_dev: publicProcedure
        .query(() => {
            return { message: "Hello Dev" }
        })
});