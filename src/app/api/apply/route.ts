import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.json();

        const db = getDB();
        await db
            .prepare(
                `INSERT INTO applications (
                    id,
                    full_name, email, location, linkedin_url,
                    what_building, why_matters, current_approach, problem_solved,
                    current_stage, product_link,
                    has_cofounder, open_to_connect,
                    background, primary_skill, superpower,
                    hours_per_week, investment_range,
                    primary_goal, success_looks_like, wants_mentors,
                    tried_before, what_happened, biggest_blocker,
                    heard_from, why_now, ready_to_commit,
                    comfortable_public, willing_to_help,
                    biggest_fear, specific_help
                ) VALUES (
                    ?1,
                    ?2, ?3, ?4, ?5,
                    ?6, ?7, ?8, ?9,
                    ?10, ?11,
                    ?12, ?13,
                    ?14, ?15, ?16,
                    ?17, ?18,
                    ?19, ?20, ?21,
                    ?22, ?23, ?24,
                    ?25, ?26, ?27,
                    ?28, ?29,
                    ?30, ?31
                )`
            )
            .bind(
                crypto.randomUUID(),
                formData.fullName || "",
                formData.email || "",
                formData.location || "",
                formData.linkedinUrl || "",
                formData.whatBuilding || "",
                formData.whyMatters || "",
                formData.currentApproach || "",
                formData.problemSolved || "",
                formData.currentStage || "",
                formData.productLink || "",
                formData.hasCofounder || "",
                formData.openToConnect || "",
                formData.background || "",
                formData.primarySkill || "",
                formData.superpower || "",
                formData.hoursPerWeek || "",
                formData.investmentRange || "",
                formData.primaryGoal || "",
                formData.successLooksLike || "",
                formData.wantsMentors || "",
                formData.triedBefore || "",
                formData.whatHappened || "",
                formData.biggestBlocker || "",
                formData.heardFrom || "",
                formData.whyNow || "",
                formData.readyToCommit || "",
                formData.comfortablePublic || "",
                formData.willingToHelp || "",
                formData.biggestFear || "",
                formData.specificHelp || ""
            )
            .run();

        console.log("[apply] ✅ Application saved to D1");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[apply] ❌ Submit error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit application" },
            { status: 500 }
        );
    }
}
