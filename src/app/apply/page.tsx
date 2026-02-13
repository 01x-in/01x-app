"use client";

import { useEffect } from "react";
import { useChat } from "./lib/use-chat";
import { ChatContainer } from "./components/chat-container";
import { ChatInput } from "./components/chat-input";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

export default function ApplyPage() {
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
    } = useChat();

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
        <div className="flex flex-col h-[100dvh] bg-background">
            {/* Navbar */}
            <Navbar variant="apply" />

            {/* Progress bar - thin strip under navbar */}
            <div className="fixed top-[calc(1rem+3.5rem+0.5rem)] left-1/2 -translate-x-1/2 z-40 w-full max-w-5xl px-6">
                <div className="flex items-center gap-3">
                    {/* Progress track */}
                    <div className="flex-1 h-1 bg-muted/50 rounded-full overflow-hidden relative">
                        {/* Glow effect */}
                        <div
                            className="absolute inset-0 h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                                width: `${progress}%`,
                                background: "linear-gradient(90deg, #d7ff00, #a8cc00)",
                                boxShadow: progress > 0 ? "0 0 12px rgba(215, 255, 0, 0.6), 0 0 4px rgba(215, 255, 0, 0.8)" : "none",
                            }}
                        />
                    </div>

                    {/* Percentage badge */}
                    <div className="flex items-center gap-2">
                        <span
                            className={`text-xs font-semibold tabular-nums px-2 py-0.5 rounded-full transition-all duration-300 ${progress > 0
                                    ? "bg-[rgba(215,255,0,0.15)] text-[#5a6600] dark:text-[#d7ff00]"
                                    : "text-muted-foreground"
                                }`}
                        >
                            {progress}%
                        </span>

                        {/* Restart button */}
                        {messages.length > 0 && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={restartChat}
                                className="text-muted-foreground hover:text-foreground h-6 w-6"
                                title="Start over"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Spacer for fixed navbar + progress bar */}
            <div className="h-20 shrink-0" />

            {/* Draft resume prompt */}
            {hasDraft && draftInfo && messages.length === 0 && (
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="bg-card border rounded-2xl p-6 max-w-md text-center space-y-4">
                        <div className="text-4xl">📝</div>
                        <h2 className="text-lg font-semibold">Welcome back!</h2>
                        <p className="text-sm text-muted-foreground">
                            You have a saved application at {draftInfo.progress}% complete.
                            Would you like to continue where you left off?
                        </p>
                        <div className="flex gap-3 justify-center pt-2">
                            <Button variant="outline" onClick={startFresh}>
                                Start Fresh
                            </Button>
                            <Button
                                onClick={resumeFromDraft}
                                className="bg-[#d7ff00] text-black hover:bg-[#c5eb00]"
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat area - only show if no draft prompt */}
            {(!hasDraft || messages.length > 0) && (
                <ChatContainer
                    messages={messages}
                    isTyping={isTyping}
                    className="container-narrow"
                />
            )}

            {/* Input area */}
            <div className="shrink-0 border-t bg-background/80 backdrop-blur-sm">
                <div className="container-narrow py-4">
                    {hasDraft && messages.length === 0 ? null : currentQuestion && !isComplete ? (
                        <ChatInput
                            question={currentQuestion}
                            onSubmit={submitAnswer}
                            disabled={isTyping}
                        />
                    ) : isComplete ? (
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                                Application submitted successfully!
                            </p>
                            <Button variant="outline" asChild>
                                <Link href="/">Return to Home</Link>
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
