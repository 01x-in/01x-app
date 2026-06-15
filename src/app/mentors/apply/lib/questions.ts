import { Question, FlowFormData as FormData } from "@/components/conversational-flow/types";

// Section transition copy
const transitions = {
    profile: "Great to meet you! Now let's understand your expertise. 🎯",
    expertise: "Almost there! 🎉 A couple of final questions to help us set up your profile.",
};

export const mentorQuestions: Question[] = [

    // ─── INTRO ───────────────────────────────────────────────────────────────
    {
        id: "intro",
        section: "intro",
        type: "confirm",
        message: `Hey there! 👋\n\nWe're building a community of exceptional mentors for early-stage builders.\n\nThis takes about 3–4 minutes. We'll ask about your background and expertise.\n\nReady?`,
        options: [{ value: "ready", label: "Let's do it", emoji: "🚀" }],
    },

    // ─── PROFILE ─────────────────────────────────────────────────────────────
    {
        id: "fullName",
        section: "profile",
        type: "text",
        message: "What's your full name?",
        placeholder: "Your full name",
        required: true,
    },
    {
        id: "email",
        section: "profile",
        type: "email",
        message: (data: FormData) =>
            `Nice to meet you, ${data.fullName?.split(" ")[0] || "friend"}! What's your email address?`,
        placeholder: "you@example.com",
        required: true,
        validation: (value: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) ? null : "Please enter a valid email address";
        },
    },
    {
        id: "title",
        section: "profile",
        type: "text",
        message: "What's your current role or title?",
        placeholder: "e.g. Founder, Head of Product at Acme",
        required: true,
    },
    {
        id: "location",
        section: "profile",
        type: "text",
        message: "Where are you based?",
        placeholder: "e.g. London, UK",
        required: true,
    },
    {
        id: "linkedinUrl",
        section: "profile",
        type: "url",
        message: "LinkedIn or portfolio URL? (This will be shown on your public profile)",
        placeholder: "https://linkedin.com/in/yourprofile",
        required: false,
    },
    {
        id: "twitterUrl",
        section: "profile",
        type: "url",
        message: "Twitter/X handle? (Optional)",
        placeholder: "https://x.com/yourhandle",
        required: false,
    },

    // ─── TRANSITION → EXPERTISE ───────────────────────────────────────────────
    {
        id: "transition-expertise",
        section: "transition",
        type: "confirm",
        message: transitions.profile,
        options: [{ value: "continue", label: "Continue", emoji: "→" }],
    },

    // ─── EXPERTISE ────────────────────────────────────────────────────────────
    {
        id: "domains",
        section: "expertise",
        type: "select",
        message: "What's your primary domain of expertise?",
        options: [
            { value: "Product", label: "Product", emoji: "📦" },
            { value: "Engineering", label: "Engineering", emoji: "💻" },
            { value: "Design", label: "Design", emoji: "🎨" },
            { value: "Growth", label: "Growth & Marketing", emoji: "📈" },
            { value: "Founder", label: "Founder / Operator", emoji: "🏗️" },
            { value: "AI", label: "AI & ML", emoji: "🤖" },
        ],
        required: true,
    },
    {
        id: "yearsExperience",
        section: "expertise",
        type: "select",
        message: "How many years of hands-on experience do you have in this domain?",
        options: [
            { value: "2-4", label: "2–4 years", emoji: "📌" },
            { value: "5-8", label: "5–8 years", emoji: "🔥" },
            { value: "9-14", label: "9–14 years", emoji: "⚡" },
            { value: "15+", label: "15+ years", emoji: "🏆" },
        ],
        required: true,
    },
    {
        id: "bioShort",
        section: "expertise",
        type: "textarea",
        message: "Give us a one-to-two sentence bio. This will appear on your public mentor card.",
        placeholder: "e.g. I co-founded two B2B SaaS companies and currently lead product at a Series B startup. I specialise in 0→1 product development and go-to-market strategy.",
        required: true,
    },
    {
        id: "biggestWin",
        section: "expertise",
        type: "textarea",
        message: "What's one thing you've built, shipped, or achieved that you're genuinely proud of?",
        placeholder: "The more specific, the better — mentees love knowing what you've actually done.",
        required: true,
    },
    {
        id: "bestAt",
        section: "expertise",
        type: "select",
        message: "Where do you add the most value when working with early-stage builders?",
        options: [
            { value: "idea-validation", label: "Idea validation & problem clarity", emoji: "🔍" },
            { value: "product-strategy", label: "Product strategy & roadmap", emoji: "🗺️" },
            { value: "technical-direction", label: "Technical direction & architecture", emoji: "⚙️" },
            { value: "growth-gtm", label: "Growth, GTM & distribution", emoji: "📣" },
            { value: "fundraising", label: "Fundraising & investor narrative", emoji: "💰" },
            { value: "hiring-team", label: "Hiring & building early team", emoji: "👥" },
        ],
        required: true,
    },

    // ─── CLOSING ─────────────────────────────────────────────────────────────
    {
        id: "transition-closing",
        section: "transition",
        type: "confirm",
        message: transitions.expertise,
        options: [{ value: "continue", label: "Continue", emoji: "→" }],
    },
    {
        id: "heardAboutUs",
        section: "closing",
        type: "select",
        message: "How did you hear about 01X?",
        options: [
            { value: "twitter", label: "Twitter / X", emoji: "🐦" },
            { value: "linkedin", label: "LinkedIn", emoji: "💼" },
            { value: "referral", label: "Someone referred me", emoji: "👋" },
            { value: "cohort-member", label: "A current cohort member", emoji: "🤝" },
            { value: "other", label: "Other", emoji: "🌐" },
        ],
        required: true,
    },
    {
        id: "anythingElse",
        section: "closing",
        type: "textarea",
        message: "Anything else you'd like us to know? Any constraints, questions, or context?",
        placeholder: "Optional — but we read every word.",
        required: false,
    },

    // ─── SUBMIT ───────────────────────────────────────────────────────────────
    {
        id: "submit",
        section: "submit",
        type: "confirm",
        message: (data: FormData) =>
            `You're all set, ${data.fullName?.split(" ")[0] || "friend"}! 🙌\n\nWe'll review your application and reach out within a few days. We keep the mentor community intentionally small — so if you're a fit, you'll know soon.\n\nReady to submit?`,
        options: [{ value: "submit", label: "Submit Application", emoji: "🚀" }],
    },
];
