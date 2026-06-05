import { NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

/**
 * PATCH /api/v1/projects/[id]/admin
 * Admin-only: toggle published, update visibility, stage
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

        const booleanFields = ["published", "request_feedback", "looking_for_collaborators"]
        const enumFields: Record<string, string[]> = {
            visibility: ["private", "collaborators", "public"],
            stage: ["zero", "one", "x"],
        }

        const updates: string[] = []
        const values: (string | number)[] = []
        let bindIdx = 1

        for (const field of booleanFields) {
            if (field in body) {
                updates.push(`${field} = ?${bindIdx}`)
                values.push(body[field] ? 1 : 0)
                bindIdx++
            }
        }

        for (const [field, allowed] of Object.entries(enumFields)) {
            if (field in body && allowed.includes(body[field])) {
                updates.push(`${field} = ?${bindIdx}`)
                values.push(body[field])
                bindIdx++
            }
        }

        if (updates.length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
        }

        await db
            .prepare(`UPDATE projects SET ${updates.join(", ")} WHERE id = ?${bindIdx}`)
            .bind(...values, id)
            .run()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[projects admin PATCH] Error:", error)
        const message = error instanceof Error ? error.message : "Update failed"
        const status = message.includes("Unauthorized") || message.includes("Forbidden") ? 403 : 500
        return NextResponse.json({ error: message }, { status })
    }
}
