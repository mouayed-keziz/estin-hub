import { edgeStoreRouter } from '@/lib/edgestore-server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';


const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;