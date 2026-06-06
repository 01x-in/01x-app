import { NextRequest, NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import { getDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { getResend, EMAIL_FROM } from "@/lib/email"
import { ApplicationApprovedEmail } from "@/emails/application-approved"
import { generateInboxAddress } from "@/lib/inbox-address"

/**
 * POST /api/v1/applications/[id]/approve
 * Admin approves a cohort or mentor application
 * - Creates a Clerk user
 * - Inserts a user row in D1
 * - Creates member/mentor record
 * - Updates application status
 * - Sends approval email
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin()
        const db = getDB()
        const { id } = await params
        let body: any = {}
        try {
            body = await request.json()
        } catch (err) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
        }

        const type = body.type || "cohort"
        if (type !== "cohort" && type !== "mentor") {
            return NextResponse.json({ error: "Invalid type. Must be 'cohort' or 'mentor'" }, { status: 400 })
        }

        // 1. Fetch the application (read-only — do NOT update status yet)
        const table = type === "mentor" ? "mentor_applications" : "applications"
        const application = await db
            .prepare(`SELECT * FROM ${table} WHERE id = ?1`)
            .bind(id)
            .first<Record<string, unknown>>()

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 })
        }
        if (application.status !== "pending") {
            return NextResponse.json({ error: "Application already processed" }, { status: 400 })
        }

        const email = (application.email as string | null | undefined)?.trim()
        const fullName = (application.full_name as string | null | undefined)?.trim()

        if (!email) {
            return NextResponse.json({ error: "Application is missing a valid email address" }, { status: 422 })
        }
        if (!fullName) {
            return NextResponse.json({ error: "Application is missing a valid full name" }, { status: 422 })
        }

        const nameParts = fullName.split(" ").filter(Boolean)
        const firstName = nameParts[0] || undefined
        const lastName = nameParts.slice(1).join(" ") || undefined

        // 2. Create Clerk user
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
            console.error("[approve] ❌ Clerk createUser failed:", errMsg)
            return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
        }

        // 3. Generate internal IDs + a unique branded @01x.in inbox address
        const userId = crypto.randomUUID()
        const roleId = crypto.randomUUID()
        const inboxEmail = await generateInboxAddress(fullName, type === "mentor" ? "mentor" : "member")

        if (type === "mentor") {
            // Atomically create mentor + user rows via D1 batch (single transaction)
            await db.batch([
                db
                    .prepare(`
          INSERT INTO mentors (id, name, title, domains, bio_short, highlights, mentoring_style, availability, location, image_src, is_approved, is_featured)
          VALUES (?1, ?2, ?3, ?4, ?5, '[]', '[]', '{}', ?6, '/mentors/default.jpg', 1, 0)
        `)
                    .bind(
                        roleId,
                        fullName,
                        (application.title as string) || "Mentor",
                        JSON.stringify([(application.domains as string) || "General"]),
                        (application.bio_short as string) || "",
                        (application.location as string) || null,
                    ),
                db
                    .prepare(`
          INSERT INTO users (id, clerk_id, email, full_name, mentor_id, inbox_email)
          VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        `)
                    .bind(userId, clerkUser.id, email, fullName, roleId, inboxEmail),
            ])

        } else {
            // Atomically create member + user rows via D1 batch (single transaction)
            await db.batch([
                db
                    .prepare(`
          INSERT INTO members (id, full_name, email, location, linkedin_url)
          VALUES (?1, ?2, ?3, ?4, ?5)
        `)
                    .bind(
                        roleId,
                        fullName,
                        email,
                        (application.location as string) || null,
                        (application.linkedin_url as string) || null
                    ),
                db
                    .prepare(`
          INSERT INTO users (id, clerk_id, email, full_name, member_id, inbox_email)
          VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        `)
                    .bind(userId, clerkUser.id, email, fullName, roleId, inboxEmail),
            ])

        }

        // 4. Send approval email (non-blocking)
        try {
            await getResend().emails.send({
                from: EMAIL_FROM,
                to: email,
                subject: "Your 01X application has been approved! 🎉",
                react: ApplicationApprovedEmail({
                    name: firstName ?? fullName,
                    role: type === "mentor" ? "mentor" : "member",
                }),
            })
        } catch (emailError) {
            console.error("[approve] ⚠️ Email send failed (non-blocking):", emailError)
        }

        // 5. All side effects succeeded — now mark the application as approved
        await db
            .prepare(`UPDATE ${table} SET status = 'approved' WHERE id = ?1`)
            .bind(id)
            .run()

        return NextResponse.json({
            success: true,
            userId,
            clerkUserId: clerkUser.id,
        })
    } catch (error) {
        console.error("[approve] ❌ Error:", error)
        const message = error instanceof Error ? error.message : "Approval failed"
        const status = message.includes("Unauthorized") || message.includes("Forbidden") ? 403 : 500
        const displayMessage = status === 403 ? "Unauthorized access" : "Internal server error"
        return NextResponse.json({ error: displayMessage }, { status })
    }
}
