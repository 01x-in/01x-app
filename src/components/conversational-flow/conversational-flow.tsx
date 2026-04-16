"use client";

import { useEffect, useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { ChatContainer } from "./chat-container";
import { ChatInput } from "./chat-input";
import { useConversationalFlow } from "./use-conversational-flow";
import { Question, FlowConfig } from "./types";

interface ConversationalFlowProps {
    questions: Question[];
    config?: FlowConfig;
    completionSlot?: ReactNode;
    onFirstInteraction?: (questionId: string) => void;
    chatClassName?: string;
}

export function ConversationalFlow({
    questions,
    config = {},
    completionSlot,
    onFirstInteraction,
    chatClassName,
}: ConversationalFlowProps) {
    const accentColor = config.accentColor ?? "var(--primary)";

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

    const [confirmingReset, setConfirmingReset] = useState(false);
    const [inputError, setInputError] = useState<string | null>(null);

    // Dismiss confirm on new message
    useEffect(() => {
        setConfirmingReset(false);
    }, [messages.length]);

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

    const showMeta = progress > 0 && !isComplete;

    return (
        <>
            {/* Spacer for fixed navbar */}
            <div className="h-16 shrink-0" />

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
                                className="hover:opacity-90"
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
                            disabled={isTyping || confirmingReset}
                            accentColor={accentColor}
                            onFirstOptionSelect={onFirstInteraction}
                            onError={setInputError}
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

                    {/* Sub-input row */}
                    {showMeta && (
                        <div className="flex items-center justify-between mt-3 px-1">
                            {/* Left: error > textarea hint > empty */}
                            <span className="text-xs">
                                {inputError ? (
                                    <span className="text-destructive">{inputError}</span>
                                ) : currentQuestion?.type === "textarea" && !confirmingReset ? (
                                    <span className="text-muted-foreground">Press ⌘+Enter to submit</span>
                                ) : null}
                            </span>

                            {/* Right: confirm UI or default progress | reset */}
                            {confirmingReset ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground">
                                        Reset all progress?
                                    </span>
                                    <button
                                        onClick={() => setConfirmingReset(false)}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => { setConfirmingReset(false); restartChat(); }}
                                        className="text-xs text-destructive hover:text-destructive/80 transition-colors underline-offset-2 hover:underline"
                                    >
                                        Yes, reset
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground tabular-nums">
                                        {progress}% complete
                                    </span>
                                    <span className="text-xs text-muted-foreground/40">|</span>
                                    <button
                                        onClick={() => setConfirmingReset(true)}
                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        title="Start over"
                                    >
                                        <RotateCcw className="h-3 w-3" />
                                        Reset
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
