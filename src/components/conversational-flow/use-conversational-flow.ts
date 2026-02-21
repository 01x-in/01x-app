"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Message, FlowFormData, ChatState, Question, FlowConfig } from "./types";

const DEFAULT_TYPING_DELAY_MIN = 800;
const DEFAULT_TYPING_DELAY_MAX = 1500;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

function getTypingDelay(
    messageLength: number,
    min = DEFAULT_TYPING_DELAY_MIN,
    max = DEFAULT_TYPING_DELAY_MAX
): number {
    const baseDelay = Math.random() * (max - min) + min;
    const lengthBonus = Math.min(messageLength * 2, 500);
    return baseDelay + lengthBonus;
}

// ─── Draft helpers ────────────────────────────────────────────────────────────

interface Draft {
    formData: FlowFormData;
    currentQuestionId: string;
    messages: Message[];
    progress: number;
    savedAt: string;
}

function saveDraft(key: string, state: ChatState) {
    if (state.isComplete || !state.currentQuestionId) return;
    const draft: Draft = {
        formData: state.formData,
        currentQuestionId: state.currentQuestionId,
        messages: state.messages,
        progress: state.progress,
        savedAt: new Date().toISOString(),
    };
    try {
        localStorage.setItem(key, JSON.stringify(draft));
    } catch (e) {
        console.error("Failed to save draft:", e);
    }
}

function loadDraft(key: string): Draft | null {
    try {
        const saved = localStorage.getItem(key);
        if (!saved) return null;
        const draft = JSON.parse(saved) as Draft;
        const daysDiff =
            (Date.now() - new Date(draft.savedAt).getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff > 7) {
            localStorage.removeItem(key);
            return null;
        }
        return draft;
    } catch (e) {
        console.error("Failed to load draft:", e);
        return null;
    }
}

function clearDraft(key: string) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error("Failed to clear draft:", e);
    }
}

// ─── Question navigation ──────────────────────────────────────────────────────

function getNextQuestion(
    questions: Question[],
    currentId: string,
    formData: FlowFormData
): Question | null {
    const currentIndex = questions.findIndex((q) => q.id === currentId);
    if (currentIndex === -1) return null;
    for (let i = currentIndex + 1; i < questions.length; i++) {
        const q = questions[i];
        if (q.skipIf && q.skipIf(formData)) continue;
        return q;
    }
    return null;
}

function calculateProgress(
    questions: Question[],
    currentId: string,
    formData: FlowFormData
): number {
    const currentIndex = questions.findIndex((q) => q.id === currentId);
    const validQuestions = questions.filter((q) => {
        if (q.section === "transition" || q.id === "intro" || q.id === "submit") return false;
        if (q.skipIf && q.skipIf(formData)) return false;
        return true;
    });
    const answered = validQuestions.filter((q) => {
        const qIndex = questions.findIndex((qn) => qn.id === q.id);
        return qIndex < currentIndex;
    }).length;
    return Math.round((answered / validQuestions.length) * 100);
}

function getQuestionById(questions: Question[], id: string): Question | undefined {
    return questions.find((q) => q.id === id);
}

function resolveMessage(
    question: Question,
    formData: FlowFormData
): string {
    if (typeof question.message === "function") {
        return question.message(formData);
    }
    return question.message;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useConversationalFlow(questions: Question[], config: FlowConfig = {}) {
    const {
        draftKey,
        completedKey,
        onComplete,
        completionMessage,
        onFirstInteraction,
        typingDelay,
    } = config;

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
    const [hasInteracted, setHasInteracted] = useState(false);

    const initialized = useRef(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        initialized.current = false;
    }, []);

    // Check for draft on mount
    useEffect(() => {
        if (!draftKey) return;
        const draft = loadDraft(draftKey);
        if (draft && draft.progress > 0) {
            setHasDraft(true);
            setDraftInfo({ progress: draft.progress, savedAt: draft.savedAt });
        }
    }, [draftKey]);

    // Auto-save draft at transition sections
    useEffect(() => {
        if (!draftKey) return;
        const currentQ = state.currentQuestionId
            ? getQuestionById(questions, state.currentQuestionId)
            : null;
        if (
            currentQ?.section === "transition" &&
            Object.keys(state.formData).length > 0 &&
            !state.isComplete
        ) {
            saveDraft(draftKey, state);
        }
    }, [state.currentQuestionId, state.isComplete, draftKey, questions, state]);

    // ── Core message helpers ───────────────────────────────────────────────

    const addBotMessage = useCallback(
        (content: string, questionId: string, onDone?: () => void) => {
            setState((prev) => ({ ...prev, isTyping: true }));

            const delay = getTypingDelay(
                content.length,
                typingDelay?.min,
                typingDelay?.max
            );

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
                onDone?.();
            }, delay);
        },
        [typingDelay]
    );

    const addUserMessage = useCallback((content: string) => {
        const newMessage: Message = {
            id: generateId(),
            type: "user",
            content,
            timestamp: new Date(),
        };
        setState((prev) => ({ ...prev, messages: [...prev.messages, newMessage] }));
    }, []);

    // ── Submit answer ──────────────────────────────────────────────────────

    const submitAnswer = useCallback(
        (answer: string, displayAnswer?: string) => {
            const { currentQuestionId, formData } = state;
            if (!currentQuestionId) return;

            // Fire onFirstInteraction once (e.g. for consent toast)
            if (!hasInteracted && onFirstInteraction) {
                onFirstInteraction();
                setHasInteracted(true);
            }

            addUserMessage(displayAnswer || answer);

            const newFormData = { ...formData, [currentQuestionId]: answer };
            setState((prev) => ({ ...prev, formData: newFormData }));

            // Final "submit" question
            if (currentQuestionId === "submit") {
                setState((prev) => ({ ...prev, isComplete: true, progress: 100 }));

                const defaultMsg =
                    "Thank you! 🎉\n\nWe've received your submission and will be in touch soon.";
                const closingMsg =
                    typeof completionMessage === "function"
                        ? completionMessage(newFormData)
                        : completionMessage ?? defaultMsg;

                setTimeout(() => {
                    addBotMessage(closingMsg, "complete");
                }, 500);

                if (completedKey) {
                    try {
                        localStorage.setItem(completedKey, JSON.stringify(newFormData));
                    } catch (_) { }
                }
                if (draftKey) clearDraft(draftKey);

                onComplete?.(newFormData);
                return;
            }

            const nextQuestion = getNextQuestion(questions, currentQuestionId, newFormData);
            if (nextQuestion) {
                const progress = calculateProgress(questions, nextQuestion.id, newFormData);
                setState((prev) => ({ ...prev, progress }));
                setTimeout(() => {
                    const content = resolveMessage(nextQuestion, newFormData);
                    addBotMessage(content, nextQuestion.id);
                }, 300);
            }
        },
        [
            state,
            hasInteracted,
            onFirstInteraction,
            addUserMessage,
            addBotMessage,
            completionMessage,
            completedKey,
            draftKey,
            onComplete,
            questions,
        ]
    );

    // ── Start / Resume ────────────────────────────────────────────────────

    const startChat = useCallback(() => {
        if (initialized.current) return;
        initialized.current = true;
        const firstQuestion = questions[0];
        if (!firstQuestion) return;
        const content = resolveMessage(firstQuestion, {});
        addBotMessage(content, firstQuestion.id);
    }, [questions, addBotMessage]);

    const resumeFromDraft = useCallback(() => {
        if (!draftKey) { startChat(); return; }
        const draft = loadDraft(draftKey);
        if (!draft) { startChat(); return; }

        initialized.current = true;
        setHasDraft(false);
        setDraftInfo(null);

        setState({
            messages: draft.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
            currentQuestionId: draft.currentQuestionId,
            formData: draft.formData,
            isTyping: false,
            isComplete: false,
            progress: draft.progress,
        });

        const currentQuestion = getQuestionById(questions, draft.currentQuestionId);
        if (currentQuestion) {
            setTimeout(() => {
                const content = resolveMessage(currentQuestion, draft.formData);
                addBotMessage(content, currentQuestion.id);
            }, 500);
        }
    }, [draftKey, questions, startChat, addBotMessage]);

    const startFresh = useCallback(() => {
        if (draftKey) clearDraft(draftKey);
        setHasDraft(false);
        setDraftInfo(null);
        startChat();
    }, [draftKey, startChat]);

    const restartChat = useCallback(() => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        if (draftKey) clearDraft(draftKey);
        initialized.current = false;
        setHasDraft(false);
        setDraftInfo(null);
        setHasInteracted(false);
        setState({
            messages: [],
            currentQuestionId: null,
            formData: {},
            isTyping: false,
            isComplete: false,
            progress: 0,
        });
        setTimeout(() => startChat(), 100);
    }, [draftKey, startChat]);

    // Auto-start on mount
    useEffect(() => {
        const draft = draftKey ? loadDraft(draftKey) : null;
        if (!draft || draft.progress === 0) {
            startChat();
        }
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, [startChat, draftKey]);

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
        hasDraft,
        draftInfo,
        resumeFromDraft,
        startFresh,
    };
}
