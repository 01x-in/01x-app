"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Message } from "./types";
import { ChatMessage } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";

interface ChatContainerProps {
    messages: Message[];
    isTyping: boolean;
    accentColor?: string;
    className?: string;
}

export function ChatContainer({ messages, isTyping, accentColor, className }: ChatContainerProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    return (
        <div
            ref={scrollRef}
            className={cn("flex-1 overflow-y-auto px-4 py-6 space-y-4", className)}
        >
            {messages.map((message, index) => (
                <ChatMessage
                    key={message.id}
                    message={message}
                    isLatest={index === messages.length - 1}
                    accentColor={accentColor}
                />
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={bottomRef} />
        </div>
    );
}
