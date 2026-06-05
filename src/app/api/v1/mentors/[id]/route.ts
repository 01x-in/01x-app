import { NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

/**
 * PATCH /api/v1/mentors/[id]
 * Admin-only: toggle is_approved, is_featured
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin()
        const db = getDB()
        const { id } = await params
        const body = await request.json()

        const allowedFields = ["is_approved", "is_featured"]
        const updates: string[] = []
        const values: (string | number)[] = []
        let bindIdx = 1

        for (const field of allowedFields) {
            if (field in body) {
                updates.push(`${field} = ?${bindIdx}`)
                values.push(body[field] ? 1 : 0)
                bindIdx++
            }
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
        }

        await db
            .prepare(`UPDATE mentors SET ${updates.join(", ")} WHERE id = ?${bindIdx}`)
            .bind(...values, id)
            .run()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[mentors PATCH] Error:", error)
        const message = error instanceof Error ? error.message : "Update failed"
        const status = message.includes("Unauthorized") || message.includes("Forbidden") ? 403 : 500
        return NextResponse.json({ error: message }, { status })
    }
}
