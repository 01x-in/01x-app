/**
 * On-demand retrieval of a received email's body via the Resend SDK.
 *
 * Resend inbound webhooks carry metadata only — the html/text body must be
 * fetched separately using resend.emails.receiving.get(email_id).
 */

import { getResend } from "@/lib/email"

export interface ReceivedEmailBody {
    html: string | null
    text: string | null
}

function decodeMaybeDataUri(html: string | null | undefined): string | null {
    if (!html) return null
    // Only decode when the string is literally a data URI (starts with "data:").
    // Resend may set html_format="data_uri" even when the html field is already
    // plain HTML — do not use html_format as the trigger.
    if (!html.startsWith("data:")) return html
    try {
        const comma = html.indexOf(",")
        const meta = html.slice(0, comma)
        const payload = html.slice(comma + 1)
        if (meta.includes(";base64")) {
            const binary = atob(payload)
            const bytes = new Uint8Array(binary.length)
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
            return new TextDecoder().decode(bytes)
        }
        return decodeURIComponent(payload)
    } catch {
        return html
    }
}

/**
 * Fetch the html/text body for a received email using the Resend SDK.
 * Returns nulls if the fetch fails so the caller can still render metadata.
 */
export async function getReceivedEmailBody(emailId: string): Promise<ReceivedEmailBody> {
    try {
        const resend = getResend()
        // resend.emails.receiving.get is available in resend v4+
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (resend.emails as any).receiving.get(emailId)

        if (result.error) {
            console.error("[inbox] ⚠️ Resend receiving.get error:", result.error)
            return { html: null, text: null }
        }

        const data = result.data ?? result
        return {
            html: decodeMaybeDataUri(data?.html as string | null | undefined),
            text: (data?.text as string | null) ?? null,
        }
    } catch (err) {
        console.error("[inbox] ⚠️ getReceivedEmailBody failed:", err)
        return { html: null, text: null }
    }
}
