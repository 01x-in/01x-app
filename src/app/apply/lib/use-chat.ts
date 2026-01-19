"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Message, FormData, ChatState, Question } from "./types";
import { questions, getNextQuestion, calculateProgress } from "./questions";

const TYPING_DELAY_MIN = 800;
const TYPING_DELAY_MAX = 1500;
const CHAR_DELAY = 25;

function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

function getTypingDelay(messageLength: number): number {
    // Longer messages = slightly longer delay, but capped
    const baseDelay = Math.random() * (TYPING_DELAY_MAX - TYPING_DELAY_MIN) + TYPING_DELAY_MIN;
    const lengthBonus = Math.min(messageLength * 2, 500);
    return baseDelay + lengthBonus;
}

export function useChat() {
    const [state, setState] = useState<ChatState>({
        messages: [],
        currentQuestionId: null,
        formData: {},
        isTyping: false,
        isComplete: false,
        progress: 0,
    });

    const initialized = useRef(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Get message content (handle functions)
    const getMessageContent = useCallback((question: Question, formData: FormData): string => {
        if (typeof question.message === "function") {
            return question.message(formData);
        }
        return question.message;
    }, []);

    // Add a bot message with typing simulation
    const addBotMessage = useCallback(
        (content: string, questionId: string, onComplete?: () => void) => {
            // First show typing indicator
            setState((prev) => ({
                ...prev,
                isTyping: true,
            }));

            // Calculate typing delay based on message length
            const delay = getTypingDelay(content.length);

            typingTimeoutRef.current = setTimeout(() => {
                const newMessage: Message = {
                    id: generateId(),
                    type: "bot",
                    content,
                    timestamp: new Date(),
                };

                setState((prev) => ({
                    ...prev,
                    messages: [...prev.messages, newMessage],
                    currentQuestionId: questionId,
                    isTyping: false,
                }));

                onComplete?.();
            }, delay);
        },
        []
    );

    // Add a user message
    const addUserMessage = useCallback((content: string) => {
        const newMessage: Message = {
            id: generateId(),
            type: "user",
            content,
            timestamp: new Date(),
        };

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, newMessage],
        }));
    }, []);

    // Process user answer and move to next question
    const submitAnswer = useCallback(
        (answer: string, displayAnswer?: string) => {
            const { currentQuestionId, formData } = state;
            if (!currentQuestionId) return;

            // Add user message
            addUserMessage(displayAnswer || answer);

            // Update form data
            const newFormData = {
                ...formData,
                [currentQuestionId]: answer,
            };

            setState((prev) => ({
                ...prev,
                formData: newFormData,
            }));

            // Check if this is the submit question
            if (currentQuestionId === "submit") {
                setState((prev) => ({
                    ...prev,
                    isComplete: true,
                    progress: 100,
                }));

                // Show completion message
                setTimeout(() => {
                    addBotMessage(
                        `Thank you for applying! 🎉\n\nWe've received your application and will review it carefully. Expect to hear from us within a few days.\n\nIn the meantime, follow us on Twitter/X for updates!`,
                        "complete"
                    );
                }, 500);

                // Store in localStorage
                localStorage.setItem("01x-application", JSON.stringify(newFormData));
                return;
            }

            // Get next question
            const nextQuestion = getNextQuestion(currentQuestionId, newFormData);

            if (nextQuestion) {
                const progress = calculateProgress(nextQuestion.id, newFormData);
                setState((prev) => ({
                    ...prev,
                    progress,
                }));

                // Show next question after a short delay
                setTimeout(() => {
                    const content = getMessageContent(nextQuestion, newFormData);
                    addBotMessage(content, nextQuestion.id);
                }, 300);
            }
        },
        [state, addUserMessage, addBotMessage, getMessageContent]
    );

    // Initialize chat with first question
    const startChat = useCallback(() => {
        if (initialized.current) return;
        initialized.current = true;

        const firstQuestion = questions[0];
        if (!firstQuestion) return;

        const content = getMessageContent(firstQuestion, {});
        addBotMessage(content, firstQuestion.id);
    }, [addBotMessage, getMessageContent]);

    // Restart chat
    const restartChat = useCallback(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        initialized.current = false;
        setState({
            messages: [],
            currentQuestionId: null,
            formData: {},
            isTyping: false,
            isComplete: false,
            progress: 0,
        });

        // Start fresh
        setTimeout(() => {
            startChat();
        }, 100);
    }, [startChat]);

    // Auto-start on mount
    useEffect(() => {
        startChat();

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [startChat]);

    // Get current question object
    const currentQuestion = state.currentQuestionId
        ? questions.find((q) => q.id === state.currentQuestionId)
        : null;

    return {
        messages: state.messages,
        currentQuestion,
        formData: state.formData,
        isTyping: state.isTyping,
        isComplete: state.isComplete,
        progress: state.progress,
        submitAnswer,
        restartChat,
    };
}
