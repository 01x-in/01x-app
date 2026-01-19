"use client";

import { cn } from "@/lib/utils";

export function TypingIndicator() {
    return (
        <div className="flex justify-start">
            <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                <span className="typing-dot" style={{ animationDelay: "0ms" }} />
                <span className="typing-dot" style={{ animationDelay: "150ms" }} />
                <span className="typing-dot" style={{ animationDelay: "300ms" }} />
            </div>
        </div>
    );
}
