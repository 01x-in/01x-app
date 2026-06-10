import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { CSV_TEMPLATE } from "@/lib/mentor-input"

/**
 * GET /api/v1/mentors/import/template — downloadable CSV template
 * for the bulk mentor import (admin-only).
 */
export async function GET() {
    try {
        await requireAdmin()
        return new NextResponse(CSV_TEMPLATE, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": 'attachment; filename="mentors-template.csv"',
            },
        })
    } catch {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }
}
