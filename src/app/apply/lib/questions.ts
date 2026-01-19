import { Question, FormData } from "./types";

// Celebration messages between sections
const celebrations = {
    demographics: "Nice to meet you! Let's talk about what you're building. 🚀",
    productVision: "Love the vision! Let me understand where you're at right now.",
    currentStage: "Got it! A few questions about your team situation...",
    team: "Great! Now let's understand your skills and background.",
    technical: "Awesome! Now for the commitment side of things...",
    commitment: "Almost there! Let's talk about your goals and expectations.",
    expectations: "Perfect! A few more questions to help us understand you better.",
    strategic: "You're doing great! 🎉 Just a couple questions about how you like to work.",
    community: "Final stretch! Just two optional questions, then we're done.",
};

export const questions: Question[] = [
    // ============ INTRO ============
    {
        id: "intro",
        section: "intro",
        type: "confirm",
        message: `Hey there, builder! 👋

I'm here to learn about what you're creating. This will take about 5-7 minutes.

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
        type: "url",
        message: "Got a LinkedIn or portfolio URL? (Optional, but helps us learn more about you)",
        placeholder: "https://linkedin.com/in/yourprofile",
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
        message: "So, what are you building? Give me the quick pitch.",
        placeholder: "Describe your product or idea in a few sentences...",
        required: true,
    },
    {
        id: "whyMatters",
        section: "productVision",
        type: "textarea",
        message: "Why does this matter to *you* personally? What's driving you?",
        placeholder: "What's your motivation behind this?",
        required: true,
    },
    {
        id: "currentApproach",
        section: "productVision",
        type: "textarea",
        message: "How are you approaching it right now? What's your current method or status?",
        placeholder: "What have you done so far?",
        required: true,
    },
    {
        id: "problemSolved",
        section: "productVision",
        type: "textarea",
        message: "What specific problem does this solve?",
        placeholder: "The problem I'm solving is...",
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

    // ============ TRANSITION TO TEAM ============
    {
        id: "transition-team",
        section: "transition",
        type: "confirm",
        message: celebrations.currentStage,
        options: [{ value: "continue", label: "Continue", emoji: "→" }],
    },

    // ============ TEAM ============
    {
        id: "hasCofounder",
        section: "team",
        type: "select",
        message: "Do you have a co-founder or team?",
        options: [
            { value: "yes", label: "Yes, I have a team", emoji: "👥" },
            { value: "no", label: "No, going solo", emoji: "🦸" },
            { value: "looking", label: "Looking for one", emoji: "🔍" },
        ],
        required: true,
    },
    {
        id: "openToConnect",
        section: "team",
        type: "select",
        message: "Would you be open to connecting with potential co-founders in the cohort?",
        options: [
            { value: "yes", label: "Yes, definitely!", emoji: "🤝" },
            { value: "no", label: "No, I'm set", emoji: "✓" },
        ],
        required: true,
    },

    // ============ TRANSITION TO TECHNICAL ============
    {
        id: "transition-technical",
        section: "transition",
        type: "confirm",
        message: celebrations.team,
        options: [{ value: "continue", label: "Continue", emoji: "→" }],
    },

    // ============ TECHNICAL PROFILE ============
    {
        id: "background",
        section: "technical",
        type: "select",
        message: "How would you describe your background?",
        options: [
            { value: "technical", label: "Technical", emoji: "💻" },
            { value: "non-technical", label: "Non-technical", emoji: "📊" },
            { value: "hybrid", label: "Hybrid (bit of both)", emoji: "🔀" },
        ],
        required: true,
    },
    {
        id: "primarySkill",
        section: "technical",
        type: "select",
        message: "What's your primary technical skill?",
        options: [
            { value: "frontend", label: "Frontend", emoji: "🎨" },
            { value: "backend", label: "Backend", emoji: "⚙️" },
            { value: "fullstack", label: "Full-stack", emoji: "🔧" },
            { value: "mobile", label: "Mobile", emoji: "📱" },
            { value: "data", label: "Data/ML", emoji: "📈" },
            { value: "other", label: "Other", emoji: "🛠️" },
        ],
        required: true,
        skipIf: (data: FormData) => data.background === "non-technical",
    },
    {
        id: "superpower",
        section: "technical",
        type: "select",
        message: "What's your superpower? The thing you're really good at?",
        options: [
            { value: "design", label: "Design", emoji: "🎨" },
            { value: "marketing", label: "Marketing", emoji: "📣" },
            { value: "sales", label: "Sales", emoji: "💼" },
            { value: "domain", label: "Domain expertise", emoji: "🎯" },
            { value: "operations", label: "Operations", emoji: "⚙️" },
            { value: "other", label: "Something else", emoji: "✨" },
        ],
        required: true,
        skipIf: (data: FormData) => data.background === "technical",
    },

    // ============ TRANSITION TO COMMITMENT ============
    {
        id: "transition-commitment",
        section: "transition",
        type: "confirm",
        message: celebrations.technical,
        options: [{ value: "continue", label: "Continue", emoji: "→" }],
    },

    // ============ COMMITMENT ============
    {
        id: "hoursPerWeek",
        section: "commitment",
        type: "select",
        message: "Realistically, how many hours per week can you commit?",
        options: [
            { value: "5-10", label: "5-10 hours", emoji: "⏰" },
            { value: "10-20", label: "10-20 hours", emoji: "⏰" },
            { value: "20-30", label: "20-30 hours", emoji: "🔥" },
            { value: "30+", label: "30+ hours", emoji: "💪" },
        ],
        required: true,
    },
    {
        id: "investmentRange",
        section: "commitment",
        type: "select",
        message: "What amount are you willing to invest in this cohort?",
        options: [
            { value: "500-1000", label: "$500 - $1,000", emoji: "💵" },
            { value: "1000-2000", label: "$1,000 - $2,000", emoji: "💵" },
            { value: "2000-3000", label: "$2,000 - $3,000", emoji: "💰" },
            { value: "3000+", label: "$3,000+", emoji: "💎" },
        ],
        required: true,
    },

    // ============ TRANSITION TO EXPECTATIONS ============
    {
        id: "transition-expectations",
        section: "transition",
        type: "confirm",
        message: celebrations.commitment,
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
    {
        id: "wantsMentors",
        section: "expectations",
        type: "select",
        message: "Would you want mentors as advisors for your project beyond the cohort?",
        options: [
            { value: "yes", label: "Yes, definitely", emoji: "🙌" },
            { value: "maybe", label: "Maybe, depends", emoji: "🤔" },
            { value: "no", label: "No, not needed", emoji: "🙅" },
        ],
        required: true,
    },

    // ============ TRANSITION TO STRATEGIC ============
    {
        id: "transition-strategic",
        section: "transition",
        type: "confirm",
        message: celebrations.expectations,
        options: [{ value: "continue", label: "Continue", emoji: "→" }],
    },

    // ============ STRATEGIC ============
    {
        id: "triedBefore",
        section: "strategic",
        type: "select",
        message: "Have you tried building something before?",
        options: [
            { value: "yes", label: "Yes", emoji: "✓" },
            { value: "no", label: "No, this is my first", emoji: "🆕" },
        ],
        required: true,
    },
    {
        id: "whatHappened",
        section: "strategic",
        type: "textarea",
        message: "What happened with that project?",
        placeholder: "Tell me about your experience...",
        required: false,
        skipIf: (data: FormData) => data.triedBefore !== "yes",
    },
    {
        id: "biggestBlocker",
        section: "strategic",
        type: "select",
        message: "What's your biggest blocker right now?",
        options: [
            { value: "technical", label: "Technical skills", emoji: "💻" },
            { value: "time", label: "Time", emoji: "⏰" },
            { value: "direction", label: "Direction/clarity", emoji: "🧭" },
            { value: "accountability", label: "Accountability", emoji: "✅" },
            { value: "funding", label: "Funding", emoji: "💰" },
            { value: "other", label: "Something else", emoji: "❓" },
        ],
        required: true,
    },
    {
        id: "heardFrom",
        section: "strategic",
        type: "select",
        message: "How did you hear about 01X?",
        options: [
            { value: "twitter", label: "Twitter/X", emoji: "🐦" },
            { value: "linkedin", label: "LinkedIn", emoji: "💼" },
            { value: "friend", label: "Friend referral", emoji: "👋" },
            { value: "search", label: "Search/Google", emoji: "🔍" },
            { value: "other", label: "Other", emoji: "🌐" },
        ],
        required: true,
    },
    {
        id: "whyNow",
        section: "strategic",
        type: "textarea",
        message: "Why now? What changed that makes you ready to commit?",
        placeholder: "What's driving you to take action now?",
        required: true,
    },
    {
        id: "readyToCommit",
        section: "strategic",
        type: "select",
        message: "Have you set aside the time and resources to participate fully?",
        options: [
            { value: "yes", label: "Yes, I'm ready", emoji: "✅" },
            { value: "working-on-it", label: "Working on it", emoji: "🔄" },
            { value: "no", label: "Not yet", emoji: "❌" },
        ],
        required: true,
    },

    // ============ TRANSITION TO COMMUNITY ============
    {
        id: "transition-community",
        section: "transition",
        type: "confirm",
        message: celebrations.strategic,
        options: [{ value: "continue", label: "Continue", emoji: "→" }],
    },

    // ============ COMMUNITY ============
    {
        id: "comfortablePublic",
        section: "community",
        type: "select",
        message: "Are you comfortable working in public? (Sharing progress, getting feedback)",
        options: [
            { value: "yes", label: "Yes, that's the point!", emoji: "📢" },
            { value: "maybe", label: "Maybe, still warming up", emoji: "🤔" },
            { value: "no", label: "Prefer to stay quiet", emoji: "🤫" },
        ],
        required: true,
    },
    {
        id: "willingToHelp",
        section: "community",
        type: "select",
        message: "Would you be willing to help other cohort members?",
        options: [
            { value: "yes", label: "Yes, that's the point!", emoji: "🤝" },
            { value: "maybe", label: "Maybe, when I can", emoji: "🤔" },
            { value: "prefer-focus", label: "Prefer to focus on my project", emoji: "🎯" },
        ],
        required: true,
    },

    // ============ TRANSITION TO CLOSING ============
    {
        id: "transition-closing",
        section: "transition",
        type: "confirm",
        message: celebrations.community,
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
