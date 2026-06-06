import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

/**
 * GET /api/v1/mentors            → all approved mentors
 * GET /api/v1/mentors?featured=1 → only featured (and approved) mentors
 * GET /api/v1/mentors?team=1     → only 01x core team members
 * GET /api/v1/mentors?id=xyz     → single mentor by id (must be approved)
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
        mentoringStyle: JSON.parse((row.mentoring_style as string) || "[]"),
        availability: JSON.parse((row.availability as string) || "{}"),
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
