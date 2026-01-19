"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Message, FormData, ChatState, Question } from "./types";
import { questions, getNextQuestion, calculateProgress, getQuestionById } from "./questions";

const TYPING_DELAY_MIN = 800;
const TYPING_DELAY_MAX = 1500;
const DRAFT_KEY = "01x-application-draft";
const COMPLETED_KEY = "01x-application";

interface Draft {
    formData: FormData;
    currentQuestionId: string;
    messages: Message[];
    progress: number;
    savedAt: string;
}

function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

function getTypingDelay(messageLength: number): number {
    const baseDelay = Math.random() * (TYPING_DELAY_MAX - TYPING_DELAY_MIN) + TYPING_DELAY_MIN;
    const lengthBonus = Math.min(messageLength * 2, 500);
    return baseDelay + lengthBonus;
}

function saveDraft(state: ChatState) {
    if (state.isComplete || !state.currentQuestionId) return;

    const draft: Draft = {
        formData: state.formData,
        currentQuestionId: state.currentQuestionId,
        messages: state.messages,
        progress: state.progress,
        savedAt: new Date().toISOString(),
    };

    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {
        console.error("Failed to save draft:", e);
    }
}

function loadDraft(): Draft | null {
    try {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (!saved) return null;

        const draft = JSON.parse(saved) as Draft;

        // Check if draft is older than 7 days
        const savedDate = new Date(draft.savedAt);
        const now = new Date();
        const daysDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff > 7) {
            localStorage.removeItem(DRAFT_KEY);
            return null;
        }

        return draft;
    } catch (e) {
        console.error("Failed to load draft:", e);
        return null;
    }
}

function clearDraft() {
    try {
        localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
        console.error("Failed to clear draft:", e);
    }
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

    const [hasDraft, setHasDraft] = useState(false);
    const [draftInfo, setDraftInfo] = useState<{ progress: number; savedAt: string } | null>(null);

    const initialized = useRef(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Check for draft on mount
    useEffect(() => {
        const draft = loadDraft();
        if (draft && draft.progress > 0) {
            setHasDraft(true);
            setDraftInfo({ progress: draft.progress, savedAt: draft.savedAt });
        }
    }, []);

    // Auto-save draft at section transitions only
    useEffect(() => {
        const currentQ = state.currentQuestionId ? getQuestionById(state.currentQuestionId) : null;
        // Save when entering a transition section (celebration messages between sections)
        if (currentQ?.section === "transition" && Object.keys(state.formData).length > 0 && !state.isComplete) {
            saveDraft(state);
        }
    }, [state.currentQuestionId, state.isComplete]);

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
            setState((prev) => ({
                ...prev,
                isTyping: true,
            }));

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

            addUserMessage(displayAnswer || answer);

            const newFormData = {
                ...formData,
                [currentQuestionId]: answer,
            };

            setState((prev) => ({
                ...prev,
                formData: newFormData,
            }));

            if (currentQuestionId === "submit") {
                setState((prev) => ({
                    ...prev,
                    isComplete: true,
                    progress: 100,
                }));

                setTimeout(() => {
                    addBotMessage(
                        `Thank you for applying! 🎉\n\nWe've received your application and will review it carefully. Expect to hear from us within a few days.\n\nIn the meantime, follow us on Twitter/X for updates!`,
                        "complete"
                    );
                }, 500);

                fetch("/api/apply", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newFormData),
                }).catch((error) => {
                    console.error("Failed to submit to API:", error);
                });

                localStorage.setItem(COMPLETED_KEY, JSON.stringify(newFormData));
                clearDraft(); // Clear draft on successful submission
                return;
            }

            const nextQuestion = getNextQuestion(currentQuestionId, newFormData);

            if (nextQuestion) {
                const progress = calculateProgress(nextQuestion.id, newFormData);
                setState((prev) => ({
                    ...prev,
                    progress,
                }));

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

    // Resume from draft
    const resumeFromDraft = useCallback(() => {
        const draft = loadDraft();
        if (!draft) {
            startChat();
            return;
        }

        initialized.current = true;
        setHasDraft(false);
        setDraftInfo(null);

        // Restore state from draft
        setState({
            messages: draft.messages.map(m => ({
                ...m,
                timestamp: new Date(m.timestamp)
            })),
            currentQuestionId: draft.currentQuestionId,
            formData: draft.formData,
            isTyping: false,
            isComplete: false,
            progress: draft.progress,
        });

        // Show the current question again
        const currentQuestion = getQuestionById(draft.currentQuestionId);
        if (currentQuestion) {
            setTimeout(() => {
                const content = getMessageContent(currentQuestion, draft.formData);
                addBotMessage(content, currentQuestion.id);
            }, 500);
        }
    }, [startChat, addBotMessage, getMessageContent]);

    // Start fresh (ignore draft)
    const startFresh = useCallback(() => {
        clearDraft();
        setHasDraft(false);
        setDraftInfo(null);
        startChat();
    }, [startChat]);

    // Restart chat
    const restartChat = useCallback(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        clearDraft();
        initialized.current = false;
        setHasDraft(false);
        setDraftInfo(null);

        setState({
            messages: [],
            currentQuestionId: null,
            formData: {},
            isTyping: false,
            isComplete: false,
            progress: 0,
        });

        setTimeout(() => {
            startChat();
        }, 100);
    }, [startChat]);

    // Auto-start on mount (only if no draft prompt needed)
    useEffect(() => {
        const draft = loadDraft();
        if (!draft || draft.progress === 0) {
            startChat();
        }

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [startChat]);

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
        // Draft-related
        hasDraft,
        draftInfo,
        resumeFromDraft,
        startFresh,
    };
}
