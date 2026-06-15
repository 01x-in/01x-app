import { clerkClient } from "@clerk/nextjs/server"
import { getDB } from "./db"
import { getResend, EMAIL_FROM } from "./email"
import { ApplicationApprovedEmail } from "@/emails/application-approved"
import { MentorInviteEmail } from "@/emails/mentor-invite"
import { generateInboxAddress } from "./inbox-address"
import type { MentorProfileInput } from "./mentor-input"

export class DuplicateUserError extends Error {
    constructor(email: string) {
        super(`A user with email ${email} already exists`)
        this.name = "DuplicateUserError"
    }
}

export class ClerkUserCreationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "ClerkUserCreationError"
    }
}

export interface CreateMentorUserResult {
    userId: string
    mentorId: string
    clerkUserId: string
    inboxEmail: string
    emailSent: boolean
}

/**
 * Create a mentor account end-to-end:
 * Clerk user → mentors + users rows (atomic D1 batch) → optional welcome email.
 *
 * Shared by application approval and direct admin creation (single + CSV).
 * Duplicate protection checks users.email only — a pending/rejected
 * application for the same email must not block direct creation.
 *
 * The SELECT-then-INSERT duplicate check is not atomic; the unique index
 * `idx_users_email_unique` (db/migrations/0003_users_email_unique.sql) is
 * the last-resort guard for concurrent requests with the same email — a
 * UNIQUE constraint violation on the users insert is also mapped to
 * DuplicateUserError below.
 */
export async function createMentorUser(
    input: MentorProfileInput,
    options: { sendWelcomeEmail: boolean; isApproval?: boolean },
): Promise<CreateMentorUserResult> {
    const db = getDB()
    const email = input.email.trim().toLowerCase()
    const fullName = input.fullName.trim()

    const existing = await db
        .prepare("SELECT id FROM users WHERE email = ?1 LIMIT 1")
        .bind(email)
        .first()
    if (existing) {
        throw new DuplicateUserError(email)
    }

    const nameParts = fullName.split(" ").filter(Boolean)
    const firstName = nameParts[0] || undefined
    const lastName = nameParts.slice(1).join(" ") || undefined

    const client = await clerkClient()
    let clerkUser
    try {
        clerkUser = await client.users.createUser({
            emailAddress: [email],
            firstName,
            lastName,
            skipPasswordRequirement: true,
        })
    } catch (clerkError: unknown) {
        const errMsg = clerkError instanceof Error ? clerkError.message : "Clerk error"
        console.error("[create-mentor-user] ❌ Clerk createUser failed:", errMsg)
        throw new ClerkUserCreationError(errMsg)
    }

    const userId = crypto.randomUUID()
    const mentorId = crypto.randomUUID()
    const inboxEmail = await generateInboxAddress(fullName, "mentor")

    try {
        await db.batch([
            db
                .prepare(`
          INSERT INTO mentors (id, name, title, domains, bio_short, bio_long, highlights, socials, location, image_src, is_approved, is_featured)
          VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 1, ?11)
        `)
                .bind(
                    mentorId,
                    fullName,
                    input.title || "Mentor",
                    JSON.stringify(input.domains && input.domains.length > 0 ? input.domains : ["General"]),
                    input.bioShort || "",
                    input.bioLong ?? null,
                    JSON.stringify(input.highlights ?? []),
                    input.socials ? JSON.stringify(input.socials) : null,
                    input.location ?? null,
                    input.imageSrc || "/mentors/default.jpg",
                    input.isFeatured ? 1 : 0,
                ),
            db
                .prepare(`
          INSERT INTO users (id, clerk_id, email, full_name, mentor_id, inbox_email)
          VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        `)
                .bind(userId, clerkUser.id, email, fullName, mentorId, inboxEmail),
        ])
    } catch (dbError) {
        // Best-effort cleanup so a D1 failure doesn't strand a Clerk user
        try {
            await client.users.deleteUser(clerkUser.id)
        } catch {
            console.error("[create-mentor-user] ⚠️ Failed to clean up Clerk user after D1 failure:", clerkUser.id)
        }
        const message = dbError instanceof Error ? dbError.message : String(dbError)
        if (message.includes("UNIQUE constraint failed: users.email")) {
            throw new DuplicateUserError(email)
        }
        throw dbError
    }

    let emailSent = false
    if (options.sendWelcomeEmail) {
        try {
            if (options.isApproval) {
                await getResend().emails.send({
                    from: EMAIL_FROM,
                    to: email,
                    subject: "Your 01X application has been approved! 🎉",
                    react: ApplicationApprovedEmail({
                        name: firstName ?? fullName,
                        role: "mentor",
                    }),
                })
            } else {
                await getResend().emails.send({
                    from: EMAIL_FROM,
                    to: email,
                    subject: "You've been added as a mentor on 01X! 🎉",
                    react: MentorInviteEmail({
                        name: firstName ?? fullName,
                    }),
                })
            }
            emailSent = true
        } catch (emailError) {
            console.error("[create-mentor-user] ⚠️ Email send failed (non-blocking):", emailError)
        }
    }

    return { userId, mentorId, clerkUserId: clerkUser.id, inboxEmail, emailSent }
}
