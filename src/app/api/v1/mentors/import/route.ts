import { NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { csvRecords } from "@/lib/csv"
import { mentorRowFromCsv, CSV_REQUIRED_HEADERS, type MentorProfileInput } from "@/lib/mentor-input"
import { createMentorUser, DuplicateUserError, ClerkUserCreationError } from "@/lib/create-mentor-user"

const MAX_FILE_BYTES = 1024 * 1024 // 1 MB
const MAX_ROWS = 200

interface RowResult {
    row: number // 1-based line in the CSV (header = row 1)
    email: string
    status: "created" | "skipped_duplicate" | "invalid" | "failed" | "valid"
    error?: string
    mentorId?: string
    inboxEmail?: string
    emailSent?: boolean
}

/**
 * POST /api/v1/mentors/import — admin-only bulk mentor creation from CSV.
 *
 * multipart/form-data:
 * - file:             the CSV (template at GET /api/v1/mentors/import/template)
 * - sendWelcomeEmail: "true" | "false" (default true)
 * - dryRun:           "true" → validate every row and report, create nothing
 *
 * All rows are validated up front (field errors, intra-file duplicate emails,
 * existing users). Creation then proceeds sequentially over valid rows only;
 * a failing row is reported but never aborts the batch.
 */
export async function POST(request: NextRequest) {
    try {
        await requireAdmin()
        const db = getDB()

        const formData = await request.formData()
        const file = formData.get("file")
        if (!(file instanceof File)) {
            return NextResponse.json({ error: "Missing CSV file" }, { status: 400 })
        }
        if (file.size > MAX_FILE_BYTES) {
            return NextResponse.json({ error: "File too large (max 1 MB)" }, { status: 413 })
        }
        const sendWelcomeEmail = formData.get("sendWelcomeEmail") !== "false"
        const dryRun = formData.get("dryRun") === "true"

        const { headers, rows } = csvRecords(await file.text())
        const missingHeaders = CSV_REQUIRED_HEADERS.filter((h) => !headers.includes(h))
        if (missingHeaders.length > 0) {
            return NextResponse.json(
                { error: `Missing required CSV columns: ${missingHeaders.join(", ")}` },
                { status: 400 }
            )
        }
        if (rows.length === 0) {
            return NextResponse.json({ error: "CSV contains no data rows" }, { status: 400 })
        }
        if (rows.length > MAX_ROWS) {
            return NextResponse.json(
                { error: `Too many rows (max ${MAX_ROWS} per import)` },
                { status: 413 }
            )
        }

        // Phase 1 — validate every row before creating anything
        const results: RowResult[] = []
        const validInputs = new Map<number, MentorProfileInput>() // index in results → input
        const seenEmails = new Set<string>()

        rows.forEach((record, idx) => {
            const rowNumber = idx + 2 // header is row 1
            const email = (record.email ?? "").trim().toLowerCase()
            const parsed = mentorRowFromCsv(record)

            if (!parsed.ok) {
                results.push({ row: rowNumber, email, status: "invalid", error: parsed.errors.join("; ") })
                return
            }
            if (seenEmails.has(parsed.value.email)) {
                results.push({
                    row: rowNumber,
                    email: parsed.value.email,
                    status: "invalid",
                    error: "Duplicate email within this file",
                })
                return
            }
            seenEmails.add(parsed.value.email)
            validInputs.set(results.length, parsed.value)
            results.push({ row: rowNumber, email: parsed.value.email, status: "valid" })
        })

        // Batch duplicate check against existing users
        if (validInputs.size > 0) {
            const emails = [...validInputs.values()].map((v) => v.email)
            const placeholders = emails.map((_, i) => `?${i + 1}`).join(", ")
            const { results: existing } = await db
                .prepare(`SELECT LOWER(email) as email FROM users WHERE LOWER(email) IN (${placeholders})`)
                .bind(...emails)
                .all()
            const existingEmails = new Set(
                existing.map((r: Record<string, unknown>) => r.email as string)
            )

            for (const [resultIdx, input] of validInputs) {
                if (existingEmails.has(input.email)) {
                    results[resultIdx].status = "skipped_duplicate"
                    validInputs.delete(resultIdx)
                }
            }
        }

        // Phase 2 — create valid rows sequentially (Clerk rate limits)
        if (!dryRun) {
            for (const [resultIdx, input] of validInputs) {
                try {
                    const created = await createMentorUser(input, { sendWelcomeEmail })
                    results[resultIdx] = {
                        ...results[resultIdx],
                        status: "created",
                        mentorId: created.mentorId,
                        inboxEmail: created.inboxEmail,
                        emailSent: created.emailSent,
                    }
                } catch (err) {
                    if (err instanceof DuplicateUserError) {
                        results[resultIdx].status = "skipped_duplicate"
                    } else {
                        const reason = err instanceof ClerkUserCreationError
                            ? "Failed to create user"
                            : "Internal error"
                        console.error(`[mentors:import] ❌ Row ${results[resultIdx].row} failed:`, err)
                        results[resultIdx] = { ...results[resultIdx], status: "failed", error: reason }
                    }
                }
            }
        }

        const count = (status: RowResult["status"]): number =>
            results.filter((r) => r.status === status).length

        return NextResponse.json({
            dryRun,
            summary: {
                total: results.length,
                valid: count("valid"),
                created: count("created"),
                skipped: count("skipped_duplicate"),
                invalid: count("invalid"),
                failed: count("failed"),
            },
            rows: results,
        })
    } catch (error) {
        console.error("[mentors:import] ❌ Error:", error)
        const message = error instanceof Error ? error.message : "Import failed"
        const status = message.includes("Unauthorized") || message.includes("Forbidden") ? 403 : 500
        const displayMessage = status === 403 ? "Unauthorized access" : "Internal server error"
        return NextResponse.json({ error: displayMessage }, { status })
    }
}
