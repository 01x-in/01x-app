import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { parseMentorInput } from "@/lib/mentor-input";
import { createMentorUser, DuplicateUserError, ClerkUserCreationError } from "@/lib/create-mentor-user";

/**
 * GET /api/v1/mentors            → all approved mentors (public)
 * GET /api/v1/mentors?featured=1 → only featured (and approved) mentors
 * GET /api/v1/mentors?team=1     → only 01x core team members
 * GET /api/v1/mentors?id=xyz     → single mentor by id (must be approved)
 *
 * POST /api/v1/mentors           → admin-only: create a mentor user directly
 */
export async function GET(request: NextRequest) {
    try {
        const db = getDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const featured = searchParams.get("featured");
        const team = searchParams.get("team");

        // Single mentor by ID
        if (id) {
            const mentor = await db
                .prepare("SELECT * FROM mentors WHERE id = ?1 AND is_approved = 1")
                .bind(id)
                .first();

            if (!mentor) {
                return NextResponse.json(
                    { error: "Mentor not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(parseMentorRow(mentor));
        }

        // 01x core team members only
        if (team === "1") {
            const { results } = await db
                .prepare(
                    "SELECT * FROM mentors WHERE is_approved = 1 AND is_team = 1 ORDER BY sort_rank ASC, name ASC"
                )
                .all();

            return NextResponse.json(results.map(parseMentorRow));
        }

        // Featured only
        if (featured === "1") {
            const { results } = await db
                .prepare(
                    "SELECT * FROM mentors WHERE is_approved = 1 AND is_featured = 1 ORDER BY sort_rank ASC, name ASC"
                )
                .all();

            return NextResponse.json(results.map(parseMentorRow));
        }

        // All approved mentors
        const { results } = await db
            .prepare(
                "SELECT * FROM mentors WHERE is_approved = 1 ORDER BY is_featured DESC, sort_rank ASC, name ASC"
            )
            .all();

        return NextResponse.json(results.map(parseMentorRow));
    } catch (error) {
        console.error("[mentors] ❌ Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch mentors" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/v1/mentors — admin creates a mentor user directly,
 * bypassing the public application journey. Note the asymmetry:
 * GET above stays public, POST requires an admin.
 */
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const parsed = parseMentorInput(body);
        if (!parsed.ok) {
            return NextResponse.json({ error: parsed.errors.join("; ") }, { status: 400 });
        }

        const sendWelcomeEmail =
            (body as Record<string, unknown>).sendWelcomeEmail !== false;

        const result = await createMentorUser(parsed.value, { sendWelcomeEmail });

        return NextResponse.json(
            {
                success: true,
                mentorId: result.mentorId,
                userId: result.userId,
                clerkUserId: result.clerkUserId,
                inboxEmail: result.inboxEmail,
                emailSent: result.emailSent,
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof DuplicateUserError) {
            return NextResponse.json(
                { error: "A user with this email already exists" },
                { status: 409 }
            );
        }
        if (error instanceof ClerkUserCreationError) {
            return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
        }
        console.error("[mentors:POST] ❌ Error:", error);
        const message = error instanceof Error ? error.message : "Creation failed";
        const status = message.includes("Unauthorized") || message.includes("Forbidden") ? 403 : 500;
        const displayMessage = status === 403 ? "Unauthorized access" : "Internal server error";
        return NextResponse.json({ error: displayMessage }, { status });
    }
}

/**
 * Parse D1 row into Mentor-shaped object with JSON columns expanded
 */
function parseMentorRow(row: Record<string, unknown>) {
    return {
        id: row.id,
        name: row.name,
        title: row.title,
        domains: JSON.parse((row.domains as string) || "[]"),
        bioShort: row.bio_short,
        bioLong: row.bio_long || undefined,
        highlights: JSON.parse((row.highlights as string) || "[]"),
        socials: row.socials ? JSON.parse(row.socials as string) : undefined,
        location: row.location || undefined,
        image: {
            src: row.image_src,
            alt: row.name,
        },
        isApproved: row.is_approved === 1,
        isFeatured: row.is_featured === 1,
        isTeam: row.is_team === 1,
        sortRank: row.sort_rank,
    };
}
