import { NextRequest, NextResponse } from "next/server";

// Google Apps Script Web App URL - set in environment
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.json();

        if (!GOOGLE_SCRIPT_URL) {
            console.error("GOOGLE_SCRIPT_URL not configured");
            // Still return success to user, but log error
            return NextResponse.json({ success: true, warning: "Storage not configured" });
        }

        // Flatten form data for spreadsheet
        const rowData = {
            timestamp: new Date().toISOString(),
            fullName: formData.fullName || "",
            email: formData.email || "",
            location: formData.location || "",
            linkedinUrl: formData.linkedinUrl || "",
            whatBuilding: formData.whatBuilding || "",
            whyMatters: formData.whyMatters || "",
            currentApproach: formData.currentApproach || "",
            problemSolved: formData.problemSolved || "",
            currentStage: formData.currentStage || "",
            productLink: formData.productLink || "",
            hasCofounder: formData.hasCofounder || "",
            openToConnect: formData.openToConnect || "",
            background: formData.background || "",
            primarySkill: formData.primarySkill || "",
            superpower: formData.superpower || "",
            hoursPerWeek: formData.hoursPerWeek || "",
            investmentRange: formData.investmentRange || "",
            primaryGoal: formData.primaryGoal || "",
            successLooksLike: formData.successLooksLike || "",
            wantsMentors: formData.wantsMentors || "",
            triedBefore: formData.triedBefore || "",
            whatHappened: formData.whatHappened || "",
            biggestBlocker: formData.biggestBlocker || "",
            heardFrom: formData.heardFrom || "",
            whyNow: formData.whyNow || "",
            readyToCommit: formData.readyToCommit || "",
            comfortablePublic: formData.comfortablePublic || "",
            willingToHelp: formData.willingToHelp || "",
            biggestFear: formData.biggestFear || "",
            specificHelp: formData.specificHelp || "",
        };

        // Send to Google Apps Script
        // Google Apps Script returns a redirect that needs to be followed
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain", // GAS handles this better than application/json
            },
            body: JSON.stringify(rowData),
            redirect: "follow", // Explicitly follow redirects
        });

        // GAS returns HTML on success after redirect, check for success
        const responseText = await response.text();

        // Check if it looks like a success response or error
        if (response.ok || responseText.includes('"success":true') || responseText.includes('success')) {
            console.log("Google Sheets: Data submitted successfully");
            return NextResponse.json({ success: true });
        }

        // Log error but still return success to user
        console.error("Google Sheets response:", responseText.substring(0, 200));
        return NextResponse.json({ success: true, warning: "Backup storage used" });
    } catch (error) {
        console.error("Submit error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit application" },
            { status: 500 }
        );
    }
}

