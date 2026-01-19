// Type definitions for the conversational form

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

export interface Question {
    id: string;
    section: string;
    type: QuestionType;
    message: string | ((formData: FormData) => string);
    placeholder?: string;
    options?: QuestionOption[];
    required?: boolean;
    validation?: (value: string) => string | null;
    // Branching: next question ID based on answer, or null for sequential
    nextQuestion?: string | ((answer: string, formData: FormData) => string | null);
    // Skip this question if condition returns true
    skipIf?: (formData: FormData) => boolean;
}

export interface Message {
    id: string;
    type: "bot" | "user";
    content: string;
    timestamp: Date;
    isTyping?: boolean;
}

export interface FormData {
    // Demographics
    fullName?: string;
    email?: string;
    location?: string;
    linkedinUrl?: string;

    // Product Vision
    whatBuilding?: string;
    whyMatters?: string;
    currentApproach?: string;
    problemSolved?: string;

    // Current Stage
    currentStage?: "zero" | "between" | "one";
    productLink?: string;

    // Team
    hasCofounder?: "yes" | "no" | "looking";
    openToConnect?: "yes" | "no";

    // Technical Profile
    background?: "technical" | "non-technical" | "hybrid";
    primarySkill?: string;
    superpower?: string;

    // Commitment
    hoursPerWeek?: string;
    investmentRange?: string;

    // Expectations
    primaryGoal?: string;
    successLooksLike?: string;
    wantsMentors?: "yes" | "maybe" | "no";

    // Strategic
    triedBefore?: "yes" | "no";
    whatHappened?: string;
    biggestBlocker?: string;
    heardFrom?: string;
    whyNow?: string;
    readyToCommit?: "yes" | "working-on-it" | "no";

    // Community
    comfortablePublic?: "yes" | "maybe" | "no";
    willingToHelp?: "yes" | "maybe" | "prefer-focus";

    // Closing
    biggestFear?: string;
    specificHelp?: string;
}

export interface ChatState {
    messages: Message[];
    currentQuestionId: string | null;
    formData: FormData;
    isTyping: boolean;
    isComplete: boolean;
    progress: number;
}
