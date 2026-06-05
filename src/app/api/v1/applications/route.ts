import { NextResponse } from "next/server"
import { getDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

/**
 * GET /api/v1/applications
 * List cohort member applications (admin only)
 */
export async function GET() {
    try {
        await requireAdmin()
        const db = getDB()

        const { results } = await db
            .prepare("SELECT * FROM applications ORDER BY created_at DESC")
            .all()

        return NextResponse.json({ applications: results })
    } catch (error) {
        console.error("[applications] ❌ GET Error:", error)
        const message = error instanceof Error ? error.message : "Failed to fetch applications"
        const status = message.includes("Unauthorized") || message.includes("Forbidden") ? 403 : 500
        return NextResponse.json({ error: message }, { status })
    }
}
