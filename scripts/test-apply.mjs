#!/usr/bin/env node

/**
 * Test script for the /api/apply endpoint
 * Run with: node scripts/test-apply.mjs
 */

const testData = {
    fullName: "Test User",
    email: "test@example.com",
    location: "San Francisco, USA",
    linkedinUrl: "https://linkedin.com/in/testuser",
    whatBuilding: "An AI-powered note-taking app",
    whyMatters: "To help people remember more and think better",
    currentApproach: "Built a prototype, getting early user feedback",
    problemSolved: "Yes, I've used it myself for 3 months",
    currentStage: "prototype",
    productLink: "https://example.com",
    hasCofounder: "solo",
    openToConnect: "yes",
    background: "technical",
    primarySkill: "Full-stack development",
    hoursPerWeek: "20+",
    investmentRange: "$1,000 - $2,000",
    primaryGoal: "Launch my first version",
    successLooksLike: "10 paying customers by end of cohort",
    wantsMentors: "yes",
    triedBefore: "no",
    biggestBlocker: "Finding early users",
    heardFrom: "Twitter",
    whyNow: "Ready to commit and build",
    readyToCommit: "yes",
    comfortablePublic: "yes",
    willingToHelp: "yes",
    biggestFear: "Not having enough time",
    specificHelp: "Marketing and user acquisition strategies",
};

async function testApply(baseUrl = "http://localhost:3000") {
    console.log("🧪 Testing /api/apply endpoint...\n");
    console.log(`📍 URL: ${baseUrl}/api/apply`);
    console.log(`📦 Payload: ${Object.keys(testData).length} fields\n`);

    try {
        const response = await fetch(`${baseUrl}/api/apply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testData),
        });

        const result = await response.json();

        console.log(`✅ Status: ${response.status}`);
        console.log(`📄 Response:`, JSON.stringify(result, null, 2));

        if (result.warning) {
            console.log(`\n⚠️  Warning: ${result.warning}`);
            console.log("   → Check that GOOGLE_SCRIPT_URL is set in .env.local");
        }

        if (result.success) {
            console.log("\n🎉 Test passed! Form data submitted successfully.");
        } else {
            console.log("\n❌ Test failed:", result.error);
        }
    } catch (error) {
        console.error("\n❌ Request failed:", error.message);
        console.log("   → Make sure the dev server is running (pnpm dev)");
    }
}

// Run the test
testApply(process.argv[2] || "http://localhost:3000");
