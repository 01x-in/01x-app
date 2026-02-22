"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { ConversationalFlow } from "@/components/conversational-flow";
import type { FlowConfig } from "@/components/conversational-flow";
import { mentorQuestions } from "./lib/questions";

const DRAFT_KEY = "01x-mentor-application-draft";
const COMPLETED_KEY = "01x-mentor-application";

const flowConfig: FlowConfig = {
    draftKey: DRAFT_KEY,
    completedKey: COMPLETED_KEY,
    accentColor: "#d7ff00",

    completionMessage: (data) =>
        `Thank you, ${data.fullName?.split(" ")[0] || "friend"}! 🙌\n\nWe review every mentor application personally and keep the community intentionally small.\n\nWe'll be in touch within a few days. In the meantime, check out the builders you'd be working with at 01x.in/apply.`,

    onComplete: async (formData) => {
        const response = await fetch("/api/mentor/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error(`Submission failed: ${response.status}`);
        }
    },
};

function showConsentToast(questionId: string) {
    if (questionId !== "intro") return;
    toast(
        <div className="flex flex-col gap-2">
            <p className="text-sm">
                By continuing, you agree to share your information with 01X. See our{" "}
                <Link href="/terms" className="underline font-medium">
                    Terms
                </Link>{" "}
                &{" "}
                <Link href="/privacy" className="underline font-medium">
                    Privacy Policy
                </Link>
                .
            </p>
        </div>,
        {
            duration: 10000,
            icon: "🔒",
            action: { label: "Ok", onClick: () => { } },
        }
    );
}

export default function MentorApplyPage() {
    return (
        <div className="flex flex-col h-[100dvh] bg-background">
            <Navbar variant="apply" backHref="/mentors" />

            <ConversationalFlow
                questions={mentorQuestions}
                config={flowConfig}
                onFirstInteraction={showConsentToast}
                chatClassName="container-narrow"
                completionSlot={
                    <div className="text-center space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Application submitted — we&apos;ll be in touch soon.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" asChild>
                                <Link href="/mentors">Back to Mentors</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/">Go Home</Link>
                            </Button>
                        </div>
                    </div>
                }
            />
        </div>
    );
}
