import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Get the D1 database instance from the Cloudflare Worker request context.
 * Only call this inside API routes / server components at request time.
 */
export function getDB(): D1Database {
    const { env } = getCloudflareContext({ async: false });
    return env.DB;
}
