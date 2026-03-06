import { NextRequest, NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import { getDB } from "@/lib/db"
import { requireRole } from "@/lib/auth"
import { resend, EMAIL_FROM } from "@/lib/email"
import { ApplicationApprovedEmail } from "@/emails/application-approved"

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
        await requireRole("admin")
        const db = getDB()
        const { id } = await params
        const body = await request.json()
        const type: "cohort" | "mentor" = body.type || "cohort"

        // 1. Atomically claim and fetch the application
        let application: Record<string, unknown> | null = null
        if (type === "mentor") {
            application = await db
                .prepare("UPDATE mentor_applications SET status = 'approved' WHERE id = ?1 AND status = 'pending' RETURNING *")
                .bind(id)
                .first()
        } else {
            application = await db
                .prepare("UPDATE applications SET status = 'approved' WHERE id = ?1 AND status = 'pending' RETURNING *")
                .bind(id)
                .first()
        }

        if (!application) {
            // Check if it exists but wasn't pending
            const table = type === "mentor" ? "mentor_applications" : "applications"
            const exists = await db.prepare(`SELECT status FROM ${table} WHERE id = ?1`).bind(id).first()

            if (!exists) {
                return NextResponse.json({ error: "Application not found" }, { status: 404 })
            }
            return NextResponse.json({ error: "Application already processed" }, { status: 400 })
        }

        const email = application.email as string
        const fullName = application.full_name as string
        const nameParts = fullName.split(" ")
        const firstName = nameParts[0]
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

        // 3. Generate internal IDs
        const userId = crypto.randomUUID()
        const roleId = crypto.randomUUID()

        if (type === "mentor") {
            // Create mentor record
            await db
                .prepare(`
          INSERT INTO mentors (id, name, title, domains, bio_short, highlights, mentoring_style, availability, location, image_src, image_alt, is_approved, is_featured)
          VALUES (?1, ?2, ?3, ?4, ?5, '[]', '[]', '{}', ?6, '/mentors/default.jpg', ?7, 1, 0)
        `)
                .bind(
                    roleId,
                    fullName,
                    (application.title as string) || "Mentor",
                    JSON.stringify([(application.domains as string) || "General"]),
                    (application.bio_short as string) || "",
                    (application.location as string) || null,
                    `${fullName} avatar`
                )
                .run()

            // Create user row
            await db
                .prepare(`
          INSERT INTO users (id, clerk_id, email, full_name, role, mentor_id)
          VALUES (?1, ?2, ?3, ?4, 'mentor', ?5)
        `)
                .bind(userId, clerkUser.id, email, fullName, roleId)
                .run()

        } else {
            // Create member record
            await db
                .prepare(`
          INSERT INTO members (id, full_name, email, member_type, location, linkedin_url)
          VALUES (?1, ?2, ?3, 'student', ?4, ?5)
        `)
                .bind(
                    roleId,
                    fullName,
                    email,
                    (application.location as string) || null,
                    (application.linkedin_url as string) || null
                )
                .run()

            // Create user row
            await db
                .prepare(`
          INSERT INTO users (id, clerk_id, email, full_name, role, member_id)
          VALUES (?1, ?2, ?3, ?4, 'member', ?5)
        `)
                .bind(userId, clerkUser.id, email, fullName, roleId)
                .run()

        }

        // 4. Send approval email
        try {
            await resend.emails.send({
                from: EMAIL_FROM,
                to: email,
                subject: "Your 01X application has been approved! 🎉",
                react: ApplicationApprovedEmail({
                    name: firstName,
                    role: type === "mentor" ? "mentor" : "member",
                }),
            })
        } catch (emailError) {
            console.error("[approve] ⚠️ Email send failed (non-blocking):", emailError)
        }

        return NextResponse.json({
            success: true,
            userId,
            clerkUserId: clerkUser.id,
        })
    } catch (error) {
        console.error("[approve] ❌ Error:", error)
        const message = error instanceof Error ? error.message : "Approval failed"
        const status = message.includes("Unauthorized") || message.includes("Forbidden") ? 403 : 500
        const displayMessage = status === 403 ? message : "Internal server error"
        return NextResponse.json({ error: displayMessage }, { status })
    }
}
