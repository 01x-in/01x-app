import { NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/db"
import { requireUser } from "@/lib/auth"
import { getReceivedEmailBody } from "@/lib/inbox"

/**
 * GET /api/v1/inbox/[id]
 * Fetch one received email (scoped to the current user), retrieve its body
 * on-demand from Resend, and mark it as read.
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const user = await requireUser()
        const db = getDB()
        const { id } = await params

        const message = await db
            .prepare(`
        SELECT id, resend_email_id, from_address, from_name, to_address,
               subject, has_attachments, attachments_json, is_read, received_at
        FROM inbox_messages
        WHERE id = ?1 AND user_id = ?2
      `)
            .bind(id, user.id)
            .first<Record<string, unknown>>()

        if (!message) {
            return NextResponse.json({ error: "Message not found" }, { status: 404 })
        }

        const body = await getReceivedEmailBody(message.resend_email_id as string)

        // Mark as read (idempotent).
        if (message.is_read !== 1) {
            await db
                .prepare("UPDATE inbox_messages SET is_read = 1 WHERE id = ?1 AND user_id = ?2")
                .bind(id, user.id)
                .run()
        }

        const attachments = message.attachments_json
            ? JSON.parse(message.attachments_json as string)
            : []

        return NextResponse.json({
            message: {
                id: message.id,
                fromAddress: message.from_address,
                fromName: message.from_name,
                toAddress: message.to_address,
                subject: message.subject,
                receivedAt: message.received_at,
                hasAttachments: message.has_attachments === 1,
                attachments,
                isRead: true,
                html: body.html,
                text: body.text,
            },
        })
    } catch (error) {
        console.error("[inbox] ❌ GET [id] Error:", error)
        const message = error instanceof Error ? error.message : "Failed to fetch message"
        const status = message.includes("Unauthorized") || message.includes("Forbidden") ? 403 : 500
        return NextResponse.json({ error: message }, { status })
    }
}
