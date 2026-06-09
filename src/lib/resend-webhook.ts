/**
 * Verify a Resend (Svix) webhook signature using Web Crypto.
 *
 * Resend signs inbound webhooks with the Svix scheme. The signed content is
 * `${svix-id}.${svix-timestamp}.${rawBody}`, HMAC-SHA256'd with the webhook
 * secret (the base64 part after the `whsec_` prefix), then base64-encoded.
 * The `svix-signature` header is a space-separated list of `v1,<sig>` entries.
 *
 * Implemented with the Web Crypto API so it runs on Cloudflare Workers without
 * pulling in the `svix` Node dependency.
 */

const TOLERANCE_SECONDS = 5 * 60

export interface SvixHeaders {
    id: string | null
    timestamp: string | null
    signature: string | null
}

function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
    const binary = atob(b64)
    const bytes = new Uint8Array(new ArrayBuffer(binary.length))
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
}

function bytesToBase64(bytes: ArrayBuffer): string {
    const view = new Uint8Array(bytes)
    let binary = ""
    for (let i = 0; i < view.length; i++) binary += String.fromCharCode(view[i])
    return btoa(binary)
}

function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false
    let result = 0
    for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    return result === 0
}

/**
 * Returns true when the signature is valid and the timestamp is within tolerance.
 */
export async function verifyResendWebhook(
    rawBody: string,
    headers: SvixHeaders,
    secret: string | undefined,
): Promise<boolean> {
    const { id, timestamp, signature } = headers
    if (!secret || !id || !timestamp || !signature) return false

    // Reject stale/future timestamps to prevent replay.
    const ts = Number(timestamp)
    if (!Number.isFinite(ts)) return false
    const now = Math.floor(Date.now() / 1000)
    if (Math.abs(now - ts) > TOLERANCE_SECONDS) return false

    const secretBytes = base64ToBytes(secret.replace(/^whsec_/, ""))
    const key = await crypto.subtle.importKey(
        "raw",
        secretBytes,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    )

    const signedContent = `${id}.${timestamp}.${rawBody}`
    const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedContent))
    const expected = bytesToBase64(mac)

    // Header may contain multiple space-separated `v1,<sig>` entries.
    for (const entry of signature.split(" ")) {
        const [, sig] = entry.split(",")
        if (sig && timingSafeEqual(sig, expected)) return true
    }
    return false
}
