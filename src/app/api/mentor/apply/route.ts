import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const db = getDB();
        await db
            .prepare(
                `INSERT INTO mentor_applications (
                    full_name, email, title, location, linkedin_url, twitter_url,
                    domains, years_experience, bio_short, biggest_win, best_at,
                    mentoring_approach, why_mentor, ideal_mentee,
                    one_on_one_frequency, async_feedback, weekend_sessions,
                    heard_about_us, anything_else
                ) VALUES (
                    ?1, ?2, ?3, ?4, ?5, ?6,
                    ?7, ?8, ?9, ?10, ?11,
                    ?12, ?13, ?14,
                    ?15, ?16, ?17,
                    ?18, ?19
                )`
            )
            .bind(
                data.fullName || "",
                data.email || "",
                data.title || "",
                data.location || "",
                data.linkedinUrl || "",
                data.twitterUrl || "",
                data.domains || "",
                data.yearsExperience || "",
                data.bioShort || "",
                data.biggestWin || "",
                data.bestAt || "",
                data.mentoringApproach || "",
                data.whyMentor || "",
                data.idealMentee || "",
                data.oneOnOneFrequency || "",
                data.asyncFeedback || "",
                data.weekendSessions || "",
                data.heardAboutUs || "",
                data.anythingElse || ""
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
