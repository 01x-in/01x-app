/**
 * Shared utilities for project display logic
 */

// Maps tech keywords → a concise domain label shown as a chip
const DOMAIN_MAP: [RegExp, string][] = [
    [/openai|gpt|llm|ai|ml|hugging/i, "AI/ML"],
    [/solidity|web3|ethers|blockchain/i, "Web3"],
    [/stripe|razorpay|lemonsqueezy/i, "Payments"],
    [/react native|expo|flutter/i, "Mobile"],
    [/electron/i, "Desktop"],
    [/prisma|supabase|postgres|mysql|d1/i, "Database"],
    [/twilio|whatsapp|sms/i, "Messaging"],
    [/next\.js|remix|nuxt/i, "SaaS"],
    [/cloudflare|workers|edge/i, "Edge"],
    [/figma|design/i, "Design"],
];

export function getDomainTags(techStack?: string[], max = 2): string[] {
    if (!techStack?.length) return [];
    const joined = techStack.join(" ");
    const seen = new Set<string>();
    const tags: string[] = [];
    for (const [re, label] of DOMAIN_MAP) {
        if (re.test(joined) && !seen.has(label)) {
            seen.add(label);
            tags.push(label);
            if (tags.length === max) break;
        }
    }
    return tags;
}
