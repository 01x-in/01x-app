"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Message } from "./types";

/**
 * Returns "#000" or "#fff" depending on which has better contrast
 * against the given hex background colour (WCAG relative luminance).
 */
function getContrastColor(hex: string): "#000" | "#fff" {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;
    // sRGB linearisation
    const toLinear = (c: number) =>
        c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    // WCAG contrast: white on dark (L < 0.179), black on light
    return L > 0.179 ? "#000" : "#fff";
}

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
                style={isBot ? undefined : { background: accentColor, color: getContrastColor(accentColor) }}
            >
                {formattedContent}
            </div>
        </div>
    );
}
