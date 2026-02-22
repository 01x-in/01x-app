"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { ConversationalFlow } from "@/components/conversational-flow";
import type { FlowConfig } from "@/components/conversational-flow";
import { questions } from "./lib/questions";

const DRAFT_KEY = "01x-application-draft";
const COMPLETED_KEY = "01x-application";

const flowConfig: FlowConfig = {
    draftKey: DRAFT_KEY,
    completedKey: COMPLETED_KEY,
    accentColor: "#d7ff00",

    completionMessage: (data) =>
        `Thank you for applying, ${data.fullName?.split(" ")[0] || "friend"}! 🎉\n\nWe've received your application and will review it carefully. Expect to hear from us within a few days.\n\nIn the meantime, follow us on Twitter/X for updates!`,

    onComplete: async (formData) => {
        const response = await fetch("/api/apply", {
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

export default function ApplyPage() {
    return (
        <div className="flex flex-col h-[100dvh] bg-background">
            <Navbar variant="apply" />

            <ConversationalFlow
                questions={questions}
                config={flowConfig}
                onFirstInteraction={showConsentToast}
                chatClassName="container-narrow"
                completionSlot={
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-3">
                            Application submitted successfully!
                        </p>
                        <Button variant="outline" asChild>
                            <Link href="/">Return to Home</Link>
                        </Button>
                    </div>
                }
            />
        </div>
    );
}
