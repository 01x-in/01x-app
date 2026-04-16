"use client";

import { useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChatContainer } from "./chat-container";
import { ChatInput } from "./chat-input";
import { ProgressBar, RestartButton } from "./progress-bar";
import { useConversationalFlow } from "./use-conversational-flow";
import { Question, FlowConfig } from "./types";

interface ConversationalFlowProps {
    questions: Question[];
    config?: FlowConfig;
    /**
     * Slot rendered when the flow is complete (after the final bot message).
     * Defaults to a simple "Back to Home" prompt.
     */
    completionSlot?: ReactNode;
    /**
     * Called when the user selects the FIRST option of the FIRST question.
     * Useful for showing a consent toast before the flow begins.
     */
    onFirstInteraction?: (questionId: string) => void;
    /** Override className of the chat messages container */
    chatClassName?: string;
}

export function ConversationalFlow({
    questions,
    config = {},
    completionSlot,
    onFirstInteraction,
    chatClassName,
}: ConversationalFlowProps) {
    const accentColor = config.accentColor ?? "var(--brand)";

    const {
        messages,
        currentQuestion,
        isTyping,
        isComplete,
        progress,
        submitAnswer,
        restartChat,
        hasDraft,
        draftInfo,
        resumeFromDraft,
        startFresh,
    } = useConversationalFlow(questions, config);

    // Handle Enter key on draft resume prompt
    useEffect(() => {
        if (!hasDraft || messages.length > 0) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                resumeFromDraft();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [hasDraft, messages.length, resumeFromDraft]);

    return (
        <>
            {/* Progress bar */}
            <ProgressBar
                progress={progress}
                accentColor={accentColor}
                actions={
                    messages.length > 0 ? (
                        <RestartButton onClick={restartChat} />
                    ) : undefined
                }
            />

            {/* Spacer for fixed navbar + progress bar */}
            <div className="h-20 shrink-0" />

            {/* Draft resume prompt */}
            {hasDraft && draftInfo && messages.length === 0 && (
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="bg-card border rounded-2xl p-6 max-w-md text-center space-y-4">
                        <div className="text-4xl">📝</div>
                        <h2 className="text-lg font-semibold">Welcome back!</h2>
                        <p className="text-sm text-muted-foreground">
                            You have a saved draft at {draftInfo.progress}% complete.
                            Would you like to continue where you left off?
                        </p>
                        <div className="flex gap-3 justify-center pt-2">
                            <Button variant="outline" onClick={startFresh}>
                                Start Fresh
                            </Button>
                            <Button
                                onClick={resumeFromDraft}
                                className="text-black hover:opacity-90"
                                style={{ backgroundColor: accentColor }}
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat area */}
            {(!hasDraft || messages.length > 0) && (
                <ChatContainer
                    messages={messages}
                    isTyping={isTyping}
                    accentColor={accentColor}
                    className={chatClassName}
                />
            )}

            {/* Input area */}
            <div className="shrink-0 border-t bg-background/80 backdrop-blur-sm">
                <div className="container-narrow py-4">
                    {hasDraft && messages.length === 0 ? null : currentQuestion &&
                        !isComplete ? (
                        <ChatInput
                            question={currentQuestion}
                            onSubmit={submitAnswer}
                            disabled={isTyping}
                            accentColor={accentColor}
                            onFirstOptionSelect={onFirstInteraction}
                        />
                    ) : isComplete ? (
                        completionSlot ?? (
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-3">
                                    Submitted successfully!
                                </p>
                            </div>
                        )
                    ) : null}
                </div>
            </div>
        </>
    );
}
