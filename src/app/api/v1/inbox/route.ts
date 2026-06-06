import { NextResponse } from "next/server"
import { getDB } from "@/lib/db"
import { requireUser } from "@/lib/auth"

/**
 * GET /api/v1/inbox
 * List the current user's received emails (metadata only), newest first.
 */
export async function GET() {
    try {
        const user = await requireUser()
        const db = getDB()

        const { results } = await db
            .prepare(`
        SELECT id, from_address, from_name, to_address, subject,
               has_attachments, is_read, received_at
        FROM inbox_messages
        WHERE user_id = ?1
        ORDER BY received_at DESC
      `)
            .bind(user.id)
            .all()

        return NextResponse.json({ messages: results, inboxEmail: user.inboxEmail })
    } catch (error) {
        console.error("[inbox] ❌ GET Error:", error)
        const message = error instanceof Error ? error.message : "Failed to fetch inbox"
        const status = message.includes("Unauthorized") || message.includes("Forbidden") ? 403 : 500
        return NextResponse.json({ error: message }, { status })
    }
}
