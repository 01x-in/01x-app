"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Question, QuestionOption } from "./types";
import { Send } from "lucide-react";

interface ChatInputProps {
    question: Question;
    onSubmit: (answer: string, displayAnswer?: string) => void;
    disabled?: boolean;
    accentColor?: string;
    /**
     * Called when the user selects the very first option (fires once per session).
     * Used by consumers to show e.g. a consent toast.
     */
    onFirstOptionSelect?: (questionId: string) => void;
}

export function ChatInput({
    question,
    onSubmit,
    disabled,
    accentColor = "var(--brand)",
    onFirstOptionSelect,
}: ChatInputProps) {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isShaking, setIsShaking] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    // Ensures onFirstOptionSelect fires at most once across all option clicks
    const hasFiredRef = useRef(false);

    useEffect(() => {
        if (inputRef.current && !disabled) {
            inputRef.current.focus();
        }
        setValue("");
        setError(null);
    }, [question.id, disabled]);

    const handleSubmit = () => {
        if (disabled) return;
        const trimmedValue = value.trim();
        if (question.required && !trimmedValue) {
            setError("This field is required");
            triggerShake();
            return;
        }
        if (question.validation && trimmedValue) {
            const validationError = question.validation(trimmedValue);
            if (validationError) {
                setError(validationError);
                triggerShake();
                return;
            }
        }
        onSubmit(trimmedValue);
    };

    const handleOptionSelect = (option: QuestionOption) => {
        if (disabled) return;
        if (!hasFiredRef.current) {
            hasFiredRef.current = true;
            onFirstOptionSelect?.(question.id);
        }
        const displayLabel = option.emoji ? `${option.emoji} ${option.label}` : option.label;
        onSubmit(option.value, displayLabel);
    };

    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            if (question.type === "textarea") {
                if (e.metaKey || e.ctrlKey) handleSubmit();
            } else {
                e.preventDefault();
                handleSubmit();
            }
        }
    };

    // Number-key & Enter shortcuts for button-type questions
    useEffect(() => {
        if (disabled) return;
        if (
            question.type !== "confirm" &&
            question.type !== "select" &&
            question.type !== "multi-select"
        ) return;

        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            const options = question.options;
            if (!options) return;

            if (e.key === "Enter" && options.length === 1) {
                e.preventDefault();
                handleOptionSelect(options[0]);
                return;
            }

            const num = parseInt(e.key);
            if (num >= 1 && num <= 9 && num <= options.length) {
                e.preventDefault();
                handleOptionSelect(options[num - 1]);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question.id, question.type, question.options, disabled]);

    // ── Button-type questions ───────────────────────────────────────────────

    if (question.type === "confirm" || question.type === "select") {
        const showNumbers = question.options && question.options.length > 1;
        return (
            <div className="space-y-2">
                <div className="flex flex-wrap gap-2 justify-center">
                    {question.options?.map((option, index) => (
                        <Button
                            key={option.value}
                            variant={question.type === "confirm" ? "default" : "outline"}
                            size="lg"
                            onClick={() => handleOptionSelect(option)}
                            disabled={disabled}
                            className={cn(
                                "transition-all relative",
                                question.type === "confirm" && "text-black hover:opacity-90"
                            )}
                            style={
                                question.type === "confirm"
                                    ? { backgroundColor: accentColor }
                                    : undefined
                            }
                        >
                            {showNumbers && (
                                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center font-mono border">
                                    {index + 1}
                                </span>
                            )}
                            {option.emoji && <span className="mr-2">{option.emoji}</span>}
                            {option.label}
                        </Button>
                    ))}
                </div>
                {showNumbers && (
                    <p className="text-xs text-muted-foreground text-center">
                        Press 1-{question.options?.length} to select
                    </p>
                )}
                {question.options?.length === 1 && (
                    <p className="text-xs text-muted-foreground text-center">
                        Press Enter to continue
                    </p>
                )}
            </div>
        );
    }

    if (question.type === "multi-select") {
        return (
            <div className="space-y-2">
                <div className="flex flex-wrap gap-2 justify-center">
                    {question.options?.map((option, index) => (
                        <Button
                            key={option.value}
                            variant="outline"
                            size="lg"
                            onClick={() => handleOptionSelect(option)}
                            disabled={disabled}
                            className="relative"
                        >
                            <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center font-mono border">
                                {index + 1}
                            </span>
                            {option.emoji && <span className="mr-2">{option.emoji}</span>}
                            {option.label}
                        </Button>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                    Press 1-{question.options?.length} to select
                </p>
            </div>
        );
    }

    // ── Text-based inputs ────────────────────────────────────────────────────

    return (
        <div className={cn("w-full", isShaking && "animate-shake")}>
            <div className="relative flex items-end gap-2 bg-card border border-border rounded-2xl p-2">
                {question.type === "textarea" ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={value}
                        onChange={(e) => { setValue(e.target.value); setError(null); }}
                        onKeyDown={handleKeyDown}
                        placeholder={question.placeholder || "Type your answer..."}
                        disabled={disabled}
                        rows={3}
                        className={cn(
                            "flex-1 bg-transparent border-0 resize-none px-3 py-2 text-[15px] placeholder:text-muted-foreground focus:outline-none",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    />
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type={
                            question.type === "email"
                                ? "email"
                                : question.type === "url"
                                    ? "url"
                                    : "text"
                        }
                        value={value}
                        onChange={(e) => { setValue(e.target.value); setError(null); }}
                        onKeyDown={handleKeyDown}
                        placeholder={question.placeholder || "Type your answer..."}
                        disabled={disabled}
                        className={cn(
                            "flex-1 bg-transparent border-0 px-3 py-2 text-[15px] placeholder:text-muted-foreground focus:outline-none",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    />
                )}
                <Button
                    size="icon"
                    onClick={handleSubmit}
                    disabled={disabled || !value.trim()}
                    className="shrink-0 text-black hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: accentColor }}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>

            {error && (
                <p className="text-sm text-destructive mt-2 px-3">{error}</p>
            )}

            {question.type === "textarea" && (
                <p className="text-xs text-muted-foreground mt-2 px-3">
                    Press ⌘+Enter to submit
                </p>
            )}
        </div>
    );
}
