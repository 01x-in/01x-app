import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // ── Required field validation ──────────────────────────────────────
        const fullName = (data.fullName ?? "").trim();
        const email = (data.email ?? "").trim();
        const title = (data.title ?? "").trim();

        if (!fullName) {
            return NextResponse.json(
                { success: false, error: "Full name is required" },
                { status: 400 }
            );
        }
        if (!email || !EMAIL_REGEX.test(email)) {
            return NextResponse.json(
                { success: false, error: "A valid email address is required" },
                { status: 400 }
            );
        }
        if (!title) {
            return NextResponse.json(
                { success: false, error: "Current role / title is required" },
                { status: 400 }
            );
        }

        // ── Optional fields (nullable in DB) ──────────────────────────────
        const location = (data.location ?? "").trim() || null;
        const linkedinUrl = (data.linkedinUrl ?? "").trim() || null;
        const twitterUrl = (data.twitterUrl ?? "").trim() || null;
        const domains = (data.domains ?? "").trim() || null;
        const yearsExperience = (data.yearsExperience ?? "").trim() || null;
        const bioShort = (data.bioShort ?? "").trim() || null;
        const biggestWin = (data.biggestWin ?? "").trim() || null;
        const bestAt = (data.bestAt ?? "").trim() || null;
        const mentoringApproach = (data.mentoringApproach ?? "").trim() || null;
        const whyMentor = (data.whyMentor ?? "").trim() || null;
        const idealMentee = (data.idealMentee ?? "").trim() || null;
        const oneOnOneFrequency = (data.oneOnOneFrequency ?? "").trim() || null;
        const asyncFeedback = (data.asyncFeedback ?? "").trim() || null;
        const weekendSessions = (data.weekendSessions ?? "").trim() || null;
        const heardAboutUs = (data.heardAboutUs ?? "").trim() || null;
        const anythingElse = (data.anythingElse ?? "").trim() || null;

        // ── Insert ────────────────────────────────────────────────────────
        const db = getDB();
        await db
            .prepare(
                `INSERT INTO mentor_applications (
                    id,
                    full_name, email, title, location, linkedin_url, twitter_url,
                    domains, years_experience, bio_short, biggest_win, best_at,
                    mentoring_approach, why_mentor, ideal_mentee,
                    one_on_one_frequency, async_feedback, weekend_sessions,
                    heard_about_us, anything_else
                ) VALUES (
                    ?1,
                    ?2, ?3, ?4, ?5, ?6, ?7,
                    ?8, ?9, ?10, ?11, ?12,
                    ?13, ?14, ?15,
                    ?16, ?17, ?18,
                    ?19, ?20
                )`
            )
            .bind(
                crypto.randomUUID(),
                fullName, email, title, location, linkedinUrl, twitterUrl,
                domains, yearsExperience, bioShort, biggestWin, bestAt,
                mentoringApproach, whyMentor, idealMentee,
                oneOnOneFrequency, asyncFeedback, weekendSessions,
                heardAboutUs, anythingElse
            )
            .run();

        console.log("[mentor/apply] ✅ Application saved to D1");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[mentor/apply] ❌ Submit error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit application" },
            { status: 500 }
        );
    }
}
