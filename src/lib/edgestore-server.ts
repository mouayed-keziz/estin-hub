
import { initEdgeStore } from '@edgestore/server';
import { initEdgeStoreClient } from '@edgestore/server/core';


const es = initEdgeStore.create();

/**
 * This is the main router for the Edge Store buckets.
 */
export const edgeStoreRouter = es.router({
    publicFiles: es.fileBucket(),
});



export const backendClient = initEdgeStoreClient({
    router: edgeStoreRouter,
});