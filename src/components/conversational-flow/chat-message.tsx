"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Message } from "./types";

/**
 * Returns "#000" or "#fff" depending on which has better contrast
 * against the given hex background colour (WCAG relative luminance).
 * Only used for raw hex accent colours; CSS-variable accents use their
 * paired `*-foreground` companion instead.
 */
function getContrastColor(hex: string): "#000" | "#fff" {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;
    const toLinear = (c: number) =>
        c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    return L > 0.179 ? "#000" : "#fff";
}

/**
 * If accentColor is a CSS variable like `var(--primary)`, derive the
 * foreground by replacing the token name with its `*-foreground` pair.
 * e.g. `var(--primary)` → `var(--primary-foreground)`
 */
function deriveForeground(accentColor: string): string {
    if (accentColor.startsWith("var(")) {
        return accentColor.replace(/var\(([^)]+)\)/, (_, token) => `var(${token}-foreground)`);
    }
    return getContrastColor(accentColor);
}

interface ChatMessageProps {
    message: Message;
    isLatest?: boolean;
    accentColor?: string;
}

export function ChatMessage({ message, isLatest: _isLatest, accentColor = "var(--primary)" }: ChatMessageProps) {
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
                style={isBot ? undefined : { background: accentColor, color: deriveForeground(accentColor) }}
            >
                {formattedContent}
            </div>
        </div>
    );
}
