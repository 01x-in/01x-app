// Mentor data types and seed data
// Single source of truth for mentor information

export type DomainTag =
  | "Product"
  | "Engineering"
  | "Design"
  | "Growth"
  | "Founder"
  | "AI";

export interface MentorAvailability {
  async: boolean;
  weekend: boolean;
  oneOnOnePerMonth?: number;
}

export interface MentorSocials {
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface MentorImage {
  src: string;
  alt: string;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  domains: DomainTag[];
  bioShort: string;
  bioLong?: string;
  highlights: string[];
  mentoringStyle: string[];
  availability: MentorAvailability;
  socials?: MentorSocials;
  location?: string;
  image: MentorImage;
  featured?: boolean;
  sortRank?: number;
}

// Seed data with realistic sample mentors
const mentors: Mentor[] = [
  {
    id: "aisha-patel",
    name: "Aisha Patel",
    title: "VP Product @ Stripe",
    domains: ["Product", "Growth", "Founder"],
    bioShort: "Built payments products used by millions. Obsessed with user friction.",
    bioLong:
      "I spent 8 years at Stripe leading product for merchant onboarding and checkout flows. Before that, I was the first PM at a fintech startup that got acquired. I've seen what it takes to go from zero to one—and what kills momentum. I focus on helping builders cut through scope creep and ship something real.",
    highlights: [
      "Led Stripe Checkout redesign (2x conversion lift)",
      "First PM hire at acquired fintech startup",
      "Shipped 12 products from 0→1",
    ],
    mentoringStyle: ["Async product reviews", "Monthly 1:1 strategy calls", "Pitch deck teardowns"],
    availability: {
      async: true,
      weekend: false,
      oneOnOnePerMonth: 2,
    },
    socials: {
      linkedin: "https://linkedin.com/in/aishapatel",
      twitter: "https://twitter.com/aishapatel",
    },
    location: "San Francisco, CA",
    image: {
      src: "/mentors/aisha-patel.jpg",
      alt: "Aisha Patel",
    },
    featured: true,
    sortRank: 1,
  },
  {
    id: "marcus-chen",
    name: "Marcus Chen",
    title: "CTO @ Series B Fintech",
    domains: ["Engineering", "AI", "Founder"],
    bioShort: "Former Google engineer. Built infra that handles 10M+ daily transactions.",
    bioLong:
      "I've been writing code for 15 years, 6 of those at Google on Cloud infrastructure. Now I'm CTO at a fintech processing millions of transactions daily. I help engineers think about architecture decisions that won't haunt them later—and how to use AI tools effectively without creating technical debt.",
    highlights: [
      "Google Cloud infrastructure team (6 years)",
      "Built transaction system processing 10M+ daily",
      "Open source contributor (3 projects with 5k+ stars)",
    ],
    mentoringStyle: ["PR code reviews", "Architecture deep dives", "Weekend debugging sessions"],
    availability: {
      async: true,
      weekend: true,
      oneOnOnePerMonth: 1,
    },
    socials: {
      linkedin: "https://linkedin.com/in/marcuschen",
      twitter: "https://twitter.com/marcuschen",
      website: "https://marcuschen.dev",
    },
    location: "Seattle, WA",
    image: {
      src: "/mentors/marcus-chen.jpg",
      alt: "Marcus Chen",
    },
    featured: true,
    sortRank: 2,
  },
  {
    id: "sofia-rodriguez",
    name: "Sofia Rodriguez",
    title: "Design Director @ Figma",
    domains: ["Design", "Product"],
    bioShort: "Design systems nerd. Believes good design is invisible.",
    bioLong:
      "I lead design systems at Figma. Before that, I was at Airbnb where I helped scale their design language across 50+ product teams. I'm passionate about teaching early-stage builders how to create coherent, usable products without a full design team—and when to break the rules.",
    highlights: [
      "Built Figma's internal design system",
      "Scaled Airbnb design language to 50+ teams",
      "Speaker at Config, Clarity, and Layers",
    ],
    mentoringStyle: ["Design critiques", "Async Figma reviews", "Workshop facilitation"],
    availability: {
      async: true,
      weekend: false,
      oneOnOnePerMonth: 2,
    },
    socials: {
      linkedin: "https://linkedin.com/in/sofiarodriguez",
      twitter: "https://twitter.com/sofiadesigns",
    },
    location: "New York, NY",
    image: {
      src: "/mentors/sofia-rodriguez.jpg",
      alt: "Sofia Rodriguez",
    },
    featured: true,
    sortRank: 3,
  },
  {
    id: "james-okonkwo",
    name: "James Okonkwo",
    title: "Founder & CEO @ DevTools Startup (YC W21)",
    domains: ["Founder", "Product", "Growth"],
    bioShort: "Raised $12M. Failed twice before. Knows what not to do.",
    bioLong:
      "Third time founder. My first two startups failed—one ran out of money, the other had a co-founder blowup. I learned more from those failures than from my current success. Now I help builders avoid the mistakes I made: bad hiring, premature scaling, and ignoring unit economics.",
    highlights: [
      "YC W21 batch ($12M raised)",
      "2 failed startups (hard-won lessons)",
      "Grew to 50+ enterprise customers in 18 months",
    ],
    mentoringStyle: ["Founder therapy sessions", "Fundraising prep", "Monthly accountability calls"],
    availability: {
      async: true,
      weekend: true,
      oneOnOnePerMonth: 3,
    },
    socials: {
      linkedin: "https://linkedin.com/in/jamesokonkwo",
      twitter: "https://twitter.com/jamesokonkwo",
    },
    location: "Lagos, Nigeria / SF",
    image: {
      src: "/mentors/james-okonkwo.jpg",
      alt: "James Okonkwo",
    },
    featured: true,
    sortRank: 4,
  },
  {
    id: "elena-vasquez",
    name: "Elena Vasquez",
    title: "Head of Growth @ Notion",
    domains: ["Growth", "Product", "Data"],
    bioShort: "Grew Notion from 1M to 30M users. Data-obsessed, BS-allergic.",
    bioLong:
      "I joined Notion when we had 1M users. Now we have 30M+. I've seen every growth hack, and I can tell you which ones actually work. I'm allergic to vanity metrics and 'growth theater.' I help builders focus on the metrics that matter and build sustainable acquisition channels.",
    highlights: [
      "Notion: 1M → 30M users",
      "Built growth team from 0 to 15 people",
      "Previously growth at Dropbox (3 years)",
    ],
    mentoringStyle: ["Growth audits", "Metrics deep dives", "Async experiment reviews"],
    availability: {
      async: true,
      weekend: false,
      oneOnOnePerMonth: 2,
    },
    socials: {
      linkedin: "https://linkedin.com/in/elenavasquez",
      twitter: "https://twitter.com/elenavasquez",
    },
    location: "San Francisco, CA",
    image: {
      src: "/mentors/elena-vasquez.jpg",
      alt: "Elena Vasquez",
    },
    featured: true,
    sortRank: 5,
  },
  {
    id: "david-kim",
    name: "David Kim",
    title: "Staff Engineer @ Vercel",
    domains: ["Engineering", "AI"],
    bioShort: "Frontend infrastructure at scale. Next.js core contributor.",
    bioLong:
      "I work on the Next.js team at Vercel. I've spent the last 5 years thinking about how to make web apps faster and developer experience better. I help builders make smart technical decisions early—choosing the right stack, avoiding premature optimization, and shipping fast.",
    highlights: [
      "Next.js core contributor",
      "Built Vercel's edge runtime",
      "Previously at Meta on React team",
    ],
    mentoringStyle: ["Code reviews", "Architecture sessions", "Performance audits"],
    availability: {
      async: true,
      weekend: true,
      oneOnOnePerMonth: 1,
    },
    socials: {
      linkedin: "https://linkedin.com/in/davidkim",
      twitter: "https://twitter.com/davidkim",
      website: "https://davidkim.io",
    },
    location: "Austin, TX",
    image: {
      src: "/mentors/david-kim.jpg",
      alt: "David Kim",
    },
    featured: true,
    sortRank: 6,
  },
  {
    id: "nina-okafor",
    name: "Nina Okafor",
    title: "VP Operations @ Late-Stage Startup",
    domains: ["Ops", "Founder", "Growth"],
    bioShort: "Scaled ops from 10 to 500 people. Process without bureaucracy.",
    bioLong:
      "I've built operations at three startups—two acquired, one public. I know how to create processes that help teams move faster, not slower. I help early-stage builders think about ops before it becomes a fire: hiring, legal basics, finance fundamentals, and when to actually start worrying about these things.",
    highlights: [
      "Scaled operations 10 → 500 people",
      "2 acquisitions, 1 IPO",
      "Built ops playbooks used by 100+ startups",
    ],
    mentoringStyle: ["Ops audits", "Hiring process reviews", "Weekend office hours"],
    availability: {
      async: true,
      weekend: true,
      oneOnOnePerMonth: 2,
    },
    socials: {
      linkedin: "https://linkedin.com/in/ninaokafor",
    },
    location: "Chicago, IL",
    image: {
      src: "/mentors/nina-okafor.jpg",
      alt: "Nina Okafor",
    },
    featured: false,
    sortRank: 7,
  },
  {
    id: "alex-thompson",
    name: "Alex Thompson",
    title: "Principal Data Scientist @ OpenAI",
    domains: ["AI", "Data", "Engineering"],
    bioShort: "ML at scale. Helping builders use AI tools that actually ship.",
    bioLong:
      "I've spent 10 years in ML/AI, the last 3 at OpenAI. I've seen the hype cycles come and go. I help builders cut through the noise and figure out where AI actually adds value to their product—and where it's just a distraction. Focus on shipping, not on chasing the latest model.",
    highlights: [
      "OpenAI research team (3 years)",
      "Previously ML lead at Uber",
      "Published 15+ ML papers",
    ],
    mentoringStyle: ["AI strategy sessions", "Technical architecture reviews", "Async feedback"],
    availability: {
      async: true,
      weekend: false,
      oneOnOnePerMonth: 1,
    },
    socials: {
      linkedin: "https://linkedin.com/in/alexthompson",
      twitter: "https://twitter.com/alexthompsonai",
      website: "https://alexthompson.ai",
    },
    location: "San Francisco, CA",
    image: {
      src: "/mentors/alex-thompson.jpg",
      alt: "Alex Thompson",
    },
    featured: true,
    sortRank: 8,
  },
];

/**
 * Get all mentors, sorted by featured first, then sortRank, then name
 */
export function getMentors(): Mentor[] {
  return [...mentors].sort((a, b) => {
    // Featured first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    // Then by sortRank
    const rankA = a.sortRank ?? 999;
    const rankB = b.sortRank ?? 999;
    if (rankA !== rankB) return rankA - rankB;

    // Then by name
    return a.name.localeCompare(b.name);
  });
}

/**
 * Get only featured mentors for landing page showcase
 */
export function getFeaturedMentors(): Mentor[] {
  return getMentors().filter((m) => m.featured);
}

/**
 * Get a mentor by ID
 */
export function getMentorById(id: string): Mentor | undefined {
  return mentors.find((m) => m.id === id);
}

/**
 * Get all unique domain tags
 */
export function getAllDomains(): DomainTag[] {
  return ["Product", "Engineering", "Design", "Growth", "Founder", "AI"];
}

/**
 * Filter mentors by domains and search query
 */
export function filterMentors(
  allMentors: Mentor[],
  selectedDomains: DomainTag[],
  searchQuery: string
): Mentor[] {
  let filtered = allMentors;

  // Filter by domains (if any selected)
  if (selectedDomains.length > 0) {
    filtered = filtered.filter((m) =>
      m.domains.some((d) => selectedDomains.includes(d))
    );
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.title.toLowerCase().includes(query) ||
        m.bioShort.toLowerCase().includes(query) ||
        m.bioLong?.toLowerCase().includes(query) ||
        m.domains.some((d) => d.toLowerCase().includes(query))
    );
  }

  return filtered;
}
