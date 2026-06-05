import { NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { getResend, EMAIL_FROM } from "@/lib/email"
import { ApplicationRejectedEmail } from "@/emails/application-rejected"

/**
 * POST /api/v1/applications/[id]/reject
 * Admin rejects a cohort or mentor application
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin()
        const db = getDB()
        const { id } = await params
        const body = await request.json()
        const type: "cohort" | "mentor" = body.type || "cohort"

        // 1. Fetch and validate
        const table = type === "mentor" ? "mentor_applications" : "applications"
        const application = await db
            .prepare(`SELECT * FROM ${table} WHERE id = ?1`)
            .bind(id)
            .first()

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 })
        }

        if (application.status !== "pending") {
            return NextResponse.json({ error: "Application already processed" }, { status: 400 })
        }

        // 2. Update status
        await db
            .prepare(`UPDATE ${table} SET status = 'rejected' WHERE id = ?1`)
            .bind(id)
            .run()

        // 3. Send rejection email
        const email = application.email as string
        const fullName = application.full_name as string
        const firstName = fullName.split(" ")[0]

        try {
            await getResend().emails.send({
                from: EMAIL_FROM,
                to: email,
                subject: "Update on your 01X application",
                react: ApplicationRejectedEmail({
                    name: firstName,
                    role: type === "mentor" ? "mentor" : "member",
                }),
            })
        } catch (emailError) {
            console.error("[reject] ⚠️ Email send failed (non-blocking):", emailError)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[reject] ❌ Error:", error)
        const message = error instanceof Error ? error.message : "Rejection failed"
        const status = message.includes("Unauthorized") || message.includes("Forbidden") ? 403 : 500
        return NextResponse.json({ error: message }, { status })
    }
}
