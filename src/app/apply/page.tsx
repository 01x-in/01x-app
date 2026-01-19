"use client";

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
    } = useChat();

    return (
        <div className="flex flex-col h-[100dvh] bg-background">
            {/* Navbar */}
            <Navbar variant="apply" />

            {/* Spacer for fixed navbar + progress bar */}
            <div className="h-24 shrink-0" />

            {/* Progress bar below navbar */}
            <div className="fixed top-[calc(1rem+3.5rem+1rem)] left-0 right-0 z-40">
                <div className="container-narrow">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#d7ff00] transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                            {progress}%
                        </span>
                        {messages.length > 0 && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={restartChat}
                                className="text-muted-foreground hover:text-foreground"
                                title="Start over"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat area */}
            <ChatContainer
                messages={messages}
                isTyping={isTyping}
                className="container-narrow"
            />

            {/* Input area */}
            <div className="shrink-0 border-t bg-background/80 backdrop-blur-sm">
                <div className="container-narrow py-4">
                    {currentQuestion && !isComplete ? (
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
