import { NextResponse } from "next/server"
import { getDB } from "@/lib/db"

/**
 * GET /api/v1/showcase
 * Public endpoint — returns projects flagged for login screen showcase
 */
export async function GET() {
    try {
        const db = getDB()

        const { results } = await db
            .prepare(`
        SELECT p.id, p.title, p.tagline, p.stage, p.cover_image_url,
               p.product_url, p.tech_stack, m.full_name as creator_name
        FROM projects p
        LEFT JOIN members m ON p.creator_id = m.id
        WHERE p.login_screen_showcase = 1
        ORDER BY p.featured_rank ASC, p.updated_at DESC
        LIMIT 10
      `)
            .all()

        return NextResponse.json({ items: results })
    } catch (error) {
        console.error("[showcase] ❌ GET Error:", error)
        return NextResponse.json({ items: [] })
    }
}
