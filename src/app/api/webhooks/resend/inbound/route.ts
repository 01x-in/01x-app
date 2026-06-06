import { NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/db"
import { verifyResendWebhook } from "@/lib/resend-webhook"

/**
 * POST /api/webhooks/resend/inbound
 *
 * Resend inbound webhook (event type `email.received`). The payload is metadata
 * only — the body/attachments are fetched on-demand from the Received Emails API
 * when the user opens the message.
 *
 * Flow:
 *  1. Verify the Svix signature against RESEND_WEBHOOK_SECRET.
 *  2. Route by the `to` address → the user whose inbox_email matches.
 *  3. Insert a metadata row in inbox_messages (idempotent on retries).
 *
 * This route lives under /api/* so it is NOT matched by the Clerk middleware
 * (which only protects /app/*), keeping it publicly reachable for Resend.
 */

interface InboundAttachment {
    id: string
    filename?: string
    content_type?: string
    content_disposition?: string | null
    content_id?: string | null
}

interface InboundEmailData {
    email_id: string
    created_at?: string
    from?: string
    to?: string[]
    cc?: string[]
    bcc?: string[]
    message_id?: string
    subject?: string
    attachments?: InboundAttachment[]
}

interface InboundEvent {
    type?: string
    created_at?: string
    data?: InboundEmailData
}

/** Parse "Name <email@host>" or "email@host" → { name, address (lowercased) }. */
function parseFromHeader(from: string | undefined): { name: string | null; address: string | null } {
    if (!from) return { name: null, address: null }
    const match = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/)
    if (match) {
        const name = match[1].replace(/^"|"$/g, "").trim() || null
        return { name, address: match[2].trim().toLowerCase() }
    }
    return { name: null, address: from.trim().toLowerCase() }
}

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text()

        const valid = await verifyResendWebhook(
            rawBody,
            {
                id: request.headers.get("svix-id"),
                timestamp: request.headers.get("svix-timestamp"),
                signature: request.headers.get("svix-signature"),
            },
            process.env.RESEND_WEBHOOK_SECRET,
        )
        if (!valid) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
        }

        let event: InboundEvent
        try {
            event = JSON.parse(rawBody) as InboundEvent
        } catch {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
        }

        // Acknowledge anything that isn't a received email so Resend stops retrying.
        if (event.type !== "email.received" || !event.data?.email_id) {
            return NextResponse.json({ received: true })
        }

        const data = event.data
        const db = getDB()

        // Match the first recipient that maps to an active user's inbox address.
        const recipients = (data.to ?? []).map((addr) => addr.trim().toLowerCase()).filter(Boolean)
        let matchedUserId: string | null = null
        let matchedAddress: string | null = null
        for (const addr of recipients) {
            const row = await db
                .prepare("SELECT id FROM users WHERE inbox_email = ?1 AND is_active = 1 LIMIT 1")
                .bind(addr)
                .first<{ id: string }>()
            if (row) {
                matchedUserId = row.id
                matchedAddress = addr
                break
            }
        }

        if (!matchedUserId) {
            // Unknown recipient — drop silently but ack so Resend doesn't retry forever.
            console.warn("[inbound] ⚠️ No matching inbox for recipients:", recipients)
            return NextResponse.json({ received: true })
        }

        const { name: fromName, address: fromAddress } = parseFromHeader(data.from)
        const attachments = data.attachments ?? []

        await db
            .prepare(`
        INSERT OR IGNORE INTO inbox_messages
          (id, user_id, resend_email_id, message_id, from_address, from_name,
           to_address, subject, has_attachments, attachments_json, received_at)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
      `)
            .bind(
                crypto.randomUUID(),
                matchedUserId,
                data.email_id,
                data.message_id ?? null,
                fromAddress,
                fromName,
                matchedAddress,
                data.subject ?? null,
                attachments.length > 0 ? 1 : 0,
                attachments.length > 0 ? JSON.stringify(attachments) : null,
                data.created_at ?? event.created_at ?? null,
            )
            .run()

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("[inbound] ❌ Error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
