/**
 * On-demand retrieval of a received email's body from the Resend
 * Received Emails API: GET https://api.resend.com/emails/receiving/:email_id
 *
 * Webhooks carry metadata only, so the html/text body is fetched here when a
 * user opens a message. The `html` field may be returned as a data URI
 * (html_format === "data_uri"), which we decode to plain HTML.
 */

const RESEND_API_BASE = "https://api.resend.com"

export interface ReceivedEmailBody {
    html: string | null
    text: string | null
}

interface ReceivedEmailResponse {
    html?: string | null
    html_format?: string | null
    text?: string | null
}

function decodeMaybeDataUri(html: string | null | undefined, format: string | null | undefined): string | null {
    if (!html) return null
    if (format === "data_uri" || html.startsWith("data:")) {
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
    return html
}

/**
 * Fetch the html/text body for a received email. Returns nulls if the API
 * call fails (the caller can still render metadata).
 */
export async function getReceivedEmailBody(emailId: string): Promise<ReceivedEmailBody> {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return { html: null, text: null }

    const res = await fetch(`${RESEND_API_BASE}/emails/receiving/${emailId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
    })

    if (!res.ok) {
        console.error("[inbox] ⚠️ Received email fetch failed:", res.status, await res.text())
        return { html: null, text: null }
    }

    const data = (await res.json()) as ReceivedEmailResponse
    return {
        html: decodeMaybeDataUri(data.html, data.html_format),
        text: data.text ?? null,
    }
}
