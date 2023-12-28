
import {
    createTRPCRouter,
    publicProcedure,
} from "@/server/api/trpc";

export const devRouter = createTRPCRouter({
    hello_dev: publicProcedure
        .query(() => {
            return { message: "Hello Dev" }
        })
});