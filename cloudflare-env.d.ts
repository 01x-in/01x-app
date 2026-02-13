// Extend the global CloudflareEnv declared by @opennextjs/cloudflare
// with our project-specific D1 binding

declare global {
    interface CloudflareEnv {
        DB: D1Database;
    }
}

export { };
