import { Question, FlowFormData as FormData } from "@/components/conversational-flow/types";

// Celebration messages between sections
const celebrations = {
    demographics: "Nice to meet you! Let's talk about what you're building. 🚀",
    productVision: "Love the vision! Let me understand where you're at right now.",
    currentStage: "Got it! One more thing about your skillset.",
    skillset: "Awesome! Now let's talk about your goals.",
    expectations: "Almost there! Just a couple optional questions to wrap up.",
};

export const questions: Question[] = [
    // ============ INTRO ============
    {
        id: "intro",
        section: "intro",
        type: "confirm",
        message: `Hey there, builder! 👋

I'm here to learn about what you're creating. This will take about 2-3 minutes.

Ready to dive in?`,
        options: [{ value: "ready", label: "Let's go!", emoji: "🚀" }],
    },

    // ============ DEMOGRAPHICS ============
    {
        id: "fullName",
        section: "demographics",
        type: "text",
        message: "What's your full name?",
        placeholder: "Your full name",
        required: true,
    },
    {
        id: "email",
        section: "demographics",
        type: "email",
        message: (data: FormData) => `Great to meet you, ${data.fullName?.split(" ")[0] || "friend"}! What's your email address?`,
        placeholder: "you@example.com",
        required: true,
        validation: (value: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) ? null : "Please enter a valid email address";
        },
    },
    {
        id: "location",
        section: "demographics",
        type: "text",
        message: "Where are you based? (City/Country)",
        placeholder: "e.g., San Francisco, USA",
        required: true,
    },
    {
        id: "linkedinUrl",
        section: "demographics",
        type: "text",
        message: "Got a LinkedIn or portfolio URL? (Optional, but helps us learn more about you)",
        inputPrefix: "https://linkedin.com/in/",
        placeholder: "yourprofile",
        required: false,
    },

    // ============ TRANSITION TO PRODUCT VISION ============
    {
        id: "transition-vision",
        section: "transition",
        type: "confirm",
        message: celebrations.demographics,
        options: [{ value: "continue", label: "Continue", emoji: "→" }],
    },

    // ============ PRODUCT VISION ============
    {
        id: "whatBuilding",
        section: "productVision",
        type: "textarea",
        message: "Give us your quick pitch! What are you building, and what problem does it solve?",
        placeholder: "Describe your product and the problem it solves...",
        required: true,
    },

    // ============ TRANSITION TO CURRENT STAGE ============
    {
        id: "transition-stage",
        section: "transition",
        type: "confirm",
        message: celebrations.productVision,
        options: [{ value: "continue", label: "Continue", emoji: "→" }],
    },

    // ============ CURRENT STAGE ============
    {
        id: "currentStage",
        section: "currentStage",
        type: "select",
        message: "Where are you in the journey right now?",
        options: [
            { value: "zero", label: "Zero — Just an idea", emoji: "💡" },
            { value: "between", label: "Between — Actively building", emoji: "🔨" },
            { value: "one", label: "One — Have an MVP", emoji: "🚀" },
        ],
        required: true,
    },
    {
        id: "productLink",
        section: "currentStage",
        type: "url",
        message: "Nice! Got a link to what you've built?",
        placeholder: "https://yourproduct.com",
        required: false,
        skipIf: (data: FormData) => data.currentStage === "zero",
    },

    // ============ TRANSITION TO SKILLSET ============
    {
        id: "transition-skillset",
        section: "transition",
        type: "confirm",
        message: celebrations.currentStage,
        options: [{ value: "continue", label: "Continue", emoji: "→" }],
    },

    // ============ SKILLSET ============
    {
        id: "superpower",
        section: "skillset",
        type: "select",
        message: "What's your superpower? The thing you're really good at?",
        options: [
            { value: "engineering", label: "Engineering", emoji: "💻" },
            { value: "product", label: "Product", emoji: "📦" },
            { value: "design", label: "Design", emoji: "🎨" },
            { value: "growth", label: "Growth & Marketing", emoji: "📣" },
        ],
        required: true,
    },

    // ============ TRANSITION TO EXPECTATIONS ============
    {
        id: "transition-expectations",
        section: "transition",
        type: "confirm",
        message: celebrations.skillset,
        options: [{ value: "continue", label: "Continue", emoji: "→" }],
    },

    // ============ EXPECTATIONS ============
    {
        id: "primaryGoal",
        section: "expectations",
        type: "select",
        message: "What's your primary goal for joining 01X?",
        options: [
            { value: "ship-mvp", label: "Ship my MVP", emoji: "🚢" },
            { value: "find-cofounder", label: "Find a co-founder", emoji: "🤝" },
            { value: "learn-build", label: "Learn to build", emoji: "📚" },
            { value: "get-feedback", label: "Get feedback", emoji: "💬" },
            { value: "accountability", label: "Accountability", emoji: "✅" },
            { value: "network", label: "Build my network", emoji: "🌐" },
        ],
        required: true,
    },
    {
        id: "successLooksLike",
        section: "expectations",
        type: "textarea",
        message: "By the end of 12 weeks, what does success look like for you?",
        placeholder: "Be specific about what you want to achieve...",
        required: true,
    },

    // ============ TRANSITION TO CLOSING ============
    {
        id: "transition-closing",
        section: "transition",
        type: "confirm",
        message: celebrations.expectations,
        options: [{ value: "continue", label: "Continue", emoji: "→" }],
    },

    // ============ CLOSING ============
    {
        id: "biggestFear",
        section: "closing",
        type: "textarea",
        message: "What's one thing you're afraid might go wrong with your project? (Optional, but helps us understand where to support you)",
        placeholder: "Be honest — we've all been there...",
        required: false,
    },
    {
        id: "specificHelp",
        section: "closing",
        type: "textarea",
        message: "If you could get one specific type of help, what would it be?",
        placeholder: "What would make the biggest difference for you?",
        required: false,
    },

    // ============ SUBMIT ============
    {
        id: "submit",
        section: "submit",
        type: "confirm",
        message: (data: FormData) => `Amazing work, ${data.fullName?.split(" ")[0] || "friend"}! 🎉

You've shared a lot, and I can tell you're serious about building something real.

Ready to submit your application?`,
        options: [{ value: "submit", label: "Submit Application", emoji: "🚀" }],
    },
];

// Get total number of non-transition questions for progress calculation
export const totalQuestions = questions.filter(
    (q) => q.section !== "transition" && q.id !== "intro" && q.id !== "submit"
).length;

// Get question by ID
export function getQuestionById(id: string): Question | undefined {
    return questions.find((q) => q.id === id);
}

// Get next question based on current answer and form data
export function getNextQuestion(
    currentId: string,
    formData: FormData
): Question | null {
    const currentIndex = questions.findIndex((q) => q.id === currentId);
    if (currentIndex === -1) return null;

    // Find next valid question (skip if skipIf returns true)
    for (let i = currentIndex + 1; i < questions.length; i++) {
        const nextQuestion = questions[i];
        if (nextQuestion.skipIf && nextQuestion.skipIf(formData)) {
            continue;
        }
        return nextQuestion;
    }

    return null;
}

// Calculate progress percentage
export function calculateProgress(currentId: string, formData: FormData): number {
    const answeredQuestions = questions.filter((q, index) => {
        if (q.section === "transition" || q.id === "intro" || q.id === "submit") return false;
        if (q.skipIf && q.skipIf(formData)) return false;
        const currentIndex = questions.findIndex((qn) => qn.id === currentId);
        return index < currentIndex;
    }).length;

    const totalValid = questions.filter((q) => {
        if (q.section === "transition" || q.id === "intro" || q.id === "submit") return false;
        if (q.skipIf && q.skipIf(formData)) return false;
        return true;
    }).length;

    return Math.round((answeredQuestions / totalValid) * 100);
}
