import { getDB } from "./db"

export const INBOX_DOMAIN = "01x.in"

type InboxUserType = "member" | "mentor"

/**
 * Build the local-part (text before @) of an inbox address from a full name.
 * Pure + deterministic — no DB access, no collision suffix.
 *
 * - Members:  first.last   (falls back to first if there is no last name)
 * - Mentors:  first        (falls back to first.last is NOT applied — mentors are first-name only)
 *
 * Names are lowercased, diacritics stripped, and reduced to [a-z0-9].
 * Returns "user" when nothing usable remains.
 */
export function buildLocalPart(fullName: string, type: InboxUserType): string {
    const clean = (s: string): string =>
        s
            .normalize("NFKD")
            .replace(/[̀-ͯ]/g, "") // strip diacritics
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")

    const parts = fullName
        .split(/\s+/)
        .map(clean)
        .filter(Boolean)

    const first = parts[0] ?? ""
    const last = parts.length > 1 ? parts[parts.length - 1] : ""

    let local: string
    if (type === "mentor") {
        local = first
    } else {
        local = last ? `${first}.${last}` : first
    }

    return local || "user"
}

/**
 * Generate a unique inbox address for a newly approved user.
 * Resolves collisions with a numeric suffix: john.wick → john.wick2 → john.wick3.
 */
export async function generateInboxAddress(
    fullName: string,
    type: InboxUserType,
): Promise<string> {
    const db = getDB()
    const base = buildLocalPart(fullName, type)

    let attempt = 0
    // attempt 0 = base, then base2, base3, ...
    while (true) {
        const local = attempt === 0 ? base : `${base}${attempt + 1}`
        const candidate = `${local}@${INBOX_DOMAIN}`
        const existing = await db
            .prepare("SELECT 1 FROM users WHERE inbox_email = ?1 LIMIT 1")
            .bind(candidate)
            .first()
        if (!existing) return candidate
        attempt += 1
    }
}
