// Generic type definitions for the ConversationalFlow component
// These are intentionally decoupled from any specific flow (apply, mentor, etc.)

export type QuestionType =
    | "text"
    | "textarea"
    | "email"
    | "url"
    | "select"
    | "multi-select"
    | "range"
    | "confirm";

export interface QuestionOption {
    value: string;
    label: string;
    emoji?: string;
}

// Generic form data — collected answers keyed by question ID
export type FlowFormData = Record<string, string>;

export interface Question {
    id: string;
    section: string;
    type: QuestionType;
    message: string | ((formData: FlowFormData) => string);
    placeholder?: string;
    options?: QuestionOption[];
    required?: boolean;
    validation?: (value: string) => string | null;
    // Branching: next question ID based on answer, or null for sequential
    nextQuestion?: string | ((answer: string, formData: FlowFormData) => string | null);
    // Skip this question if condition returns true
    skipIf?: (formData: FlowFormData) => boolean;
}

export interface Message {
    id: string;
    type: "bot" | "user";
    content: string;
    timestamp: Date;
    isTyping?: boolean;
}

export interface ChatState {
    messages: Message[];
    currentQuestionId: string | null;
    formData: FlowFormData;
    isTyping: boolean;
    isComplete: boolean;
    progress: number;
}

// ─── Flow Config ────────────────────────────────────────────────────────────

export interface FlowConfig {
    /** localStorage key for saving draft progress. Omit to disable drafts. */
    draftKey?: string;
    /** localStorage key for storing the completed submission. */
    completedKey?: string;
    /**
     * Called when the user submits the final answer.
     * Use this to POST to an API endpoint, etc.
     */
    onComplete?: (formData: FlowFormData) => void | Promise<void>;
    /**
     * The bot's closing message shown after completion.
     * Can be a static string or a function of collected form data.
     */
    completionMessage?: string | ((formData: FlowFormData) => string);
    /**
     * Optional callback fired when the user interacts with the very first
     * question option (e.g. to show a consent toast).
     */
    onFirstInteraction?: () => void;
    /**
     * Accent colour used for the progress bar and user-bubble background.
     * Defaults to "#d7ff00".
     */
    accentColor?: string;
    /**
     * Tuning for the simulated typing delay in milliseconds.
     */
    typingDelay?: { min: number; max: number };
}
