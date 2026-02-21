"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Message } from "./types";

interface ChatMessageProps {
    message: Message;
    isLatest?: boolean;
    accentColor?: string;
}

export function ChatMessage({ message, isLatest: _isLatest, accentColor = "#d7ff00" }: ChatMessageProps) {
    const isBot = message.type === "bot";
    const messageRef = useRef<HTMLDivElement>(null);

    // Animate in on mount
    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.style.opacity = "0";
            messageRef.current.style.transform = "translateY(8px)";

            requestAnimationFrame(() => {
                if (messageRef.current) {
                    messageRef.current.style.transition = "opacity 0.3s ease, transform 0.3s ease";
                    messageRef.current.style.opacity = "1";
                    messageRef.current.style.transform = "translateY(0)";
                }
            });
        }
    }, []);

    const formattedContent = message.content.split("\n").map((line, i, arr) => (
        <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
        </span>
    ));

    return (
        <div
            ref={messageRef}
            className={cn("flex w-full", isBot ? "justify-start" : "justify-end")}
        >
            <div
                className={cn(
                    "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
                    isBot
                        ? "bg-card border border-border/50 text-foreground rounded-bl-md"
                        : "rounded-br-md font-medium"
                )}
                style={isBot ? undefined : { background: accentColor, color: "#000" }}
            >
                {formattedContent}
            </div>
        </div>
    );
}
