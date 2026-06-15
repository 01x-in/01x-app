/**
 * Validation for admin mentor creation (single form + CSV import).
 * Hand-rolled like the rest of the API routes — Zod is not a dependency here.
 */

export interface MentorProfileInput {
    fullName: string
    email: string
    title?: string
    domains?: string[]
    location?: string | null
    bioShort?: string
    bioLong?: string | null
    highlights?: string[]
    socials?: { linkedin?: string; twitter?: string; website?: string } | null
    imageSrc?: string
    isFeatured?: boolean
}

export type ParseResult =
    | { ok: true; value: MentorProfileInput }
    | { ok: false; errors: string[] }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// The public site renders these six tags; the DB stores free-form JSON so
// unknown domains are allowed through, the admin form just constrains the UI.
export const KNOWN_DOMAINS = ["Product", "Engineering", "Design", "Growth", "Founder", "AI"] as const

function asTrimmedString(value: unknown): string | undefined {
    if (typeof value !== "string") return undefined
    const trimmed = value.trim()
    return trimmed === "" ? undefined : trimmed
}

function asStringArray(value: unknown): string[] | undefined {
    if (!Array.isArray(value)) return undefined
    const items = value
        .filter((v): v is string => typeof v === "string")
        .map((v) => v.trim())
        .filter(Boolean)
    return items.length > 0 ? items : undefined
}

export function parseMentorInput(raw: unknown): ParseResult {
    if (typeof raw !== "object" || raw === null) {
        return { ok: false, errors: ["Invalid payload"] }
    }
    const input = raw as Record<string, unknown>
    const errors: string[] = []

    const fullName = asTrimmedString(input.fullName)
    if (!fullName) errors.push("Full name is required")

    const email = asTrimmedString(input.email)?.toLowerCase()
    if (!email) {
        errors.push("Email is required")
    } else if (!EMAIL_RE.test(email)) {
        errors.push("Invalid email")
    }

    let socials: MentorProfileInput["socials"]
    if (typeof input.socials === "object" && input.socials !== null) {
        const soc = input.socials as Record<string, unknown>
        const linkedin = asTrimmedString(soc.linkedin)
        const twitter = asTrimmedString(soc.twitter)
        const website = asTrimmedString(soc.website)
        if (linkedin || twitter || website) {
            socials = {
                ...(linkedin ? { linkedin } : {}),
                ...(twitter ? { twitter } : {}),
                ...(website ? { website } : {}),
            }
        }
    }

    if (errors.length > 0) return { ok: false, errors }

    return {
        ok: true,
        value: {
            fullName: fullName as string,
            email: email as string,
            title: asTrimmedString(input.title),
            domains: asStringArray(input.domains),
            location: asTrimmedString(input.location) ?? null,
            bioShort: asTrimmedString(input.bioShort),
            bioLong: asTrimmedString(input.bioLong) ?? null,
            highlights: asStringArray(input.highlights),
            socials: socials ?? null,
            imageSrc: asTrimmedString(input.imageSrc),
            isFeatured: input.isFeatured === true,
        },
    }
}

const TRUTHY = new Set(["true", "yes", "1", "y"])
const FALSY = new Set(["false", "no", "0", "n", ""])

function csvBoolean(value: string, column: string, errors: string[]): boolean | undefined {
    const normalized = value.trim().toLowerCase()
    if (TRUTHY.has(normalized)) return true
    if (FALSY.has(normalized)) return normalized === "" ? undefined : false
    errors.push(`Invalid ${column} "${value}" (use true/false)`)
    return undefined
}

function csvList(value: string): string[] | undefined {
    const items = value.split("|").map((v) => v.trim()).filter(Boolean)
    return items.length > 0 ? items : undefined
}

/**
 * Map a CSV record (from csvRecords) into MentorProfileInput via the same
 * validator the single-create endpoint uses.
 *
 * Multi-value cells (domains, highlights) are pipe-separated.
 */
export function mentorRowFromCsv(record: Record<string, string>): ParseResult {
    const errors: string[] = []
    const isFeatured = csvBoolean(record.is_featured ?? "", "is_featured", errors)
    if (errors.length > 0) return { ok: false, errors }

    return parseMentorInput({
        fullName: record.full_name,
        email: record.email,
        title: record.title,
        domains: csvList(record.domains ?? ""),
        location: record.location,
        bioShort: record.bio_short,
        bioLong: record.bio_long,
        highlights: csvList(record.highlights ?? ""),
        socials: {
            linkedin: record.linkedin,
            twitter: record.twitter,
            website: record.website,
        },
        imageSrc: record.image_src,
        isFeatured: isFeatured === true,
    })
}

export const CSV_REQUIRED_HEADERS = ["full_name", "email"] as const

export const CSV_TEMPLATE = `full_name,email,title,domains,location,bio_short,bio_long,highlights,linkedin,twitter,website,image_src,is_featured
Jane Doe,jane@example.com,Head of Product,Product|AI,"Bengaluru, India","Product leader, 12y in consumer apps.","Longer bio goes here, commas are fine inside quotes.",Scaled app to 10M users|Ex-Acme,https://linkedin.com/in/janedoe,https://x.com/janedoe,https://janedoe.com,,false
`
