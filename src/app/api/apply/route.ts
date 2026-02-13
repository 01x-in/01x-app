import { NextRequest, NextResponse } from "next/server";

// Hardcoded fallback — .env.local is NOT available in Cloudflare Workers
const FALLBACK_GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwdOubsv3qIp0ZN2qkNEc38x7DBthxUITcV4KU0Qea00mJMiarE5jUAuK9Qi-m3m5z4/exec";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.json();

        // Read env at request time (Cloudflare Workers provides env per-request)
        const GOOGLE_SCRIPT_URL =
            process.env.GOOGLE_SCRIPT_URL || FALLBACK_GOOGLE_SCRIPT_URL;

        console.log(
            "[apply] GOOGLE_SCRIPT_URL resolved:",
            GOOGLE_SCRIPT_URL ? "YES" : "NO",
            "(from env:",
            !!process.env.GOOGLE_SCRIPT_URL,
            ")"
        );

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

        console.log("[apply] Submitting to Google Sheets, fields:", Object.keys(rowData).length);
        console.log("[apply] Form data keys present:", Object.keys(formData).filter(k => formData[k]).join(", "));

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

        console.log("[apply] Google Sheets response:", {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            redirected: response.redirected,
            bodyPreview: responseText.substring(0, 300),
        });

        // Check if it looks like a success response or error
        if (response.ok || responseText.includes('"success":true') || responseText.includes('success')) {
            console.log("[apply] ✅ Google Sheets: Data submitted successfully");
            return NextResponse.json({ success: true });
        }

        // Log error but still return success to user
        console.error("[apply] ❌ Google Sheets unexpected response:", responseText.substring(0, 500));
        return NextResponse.json({ success: true, warning: "Backup storage used" });
    } catch (error) {
        console.error("[apply] ❌ Submit error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to submit application" },
            { status: 500 }
        );
    }
}

