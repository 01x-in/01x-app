// Mentor data types — single source of truth
// Actual data lives in D1 database, fetched via /api/v1/mentors

export type DomainTag =
  | "Product"
  | "Engineering"
  | "Design"
  | "Growth"
  | "Founder"
  | "AI";

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
  socials?: MentorSocials;
  location?: string;
  image: MentorImage;
  isApproved: boolean;
  isFeatured: boolean;
  isTeam: boolean;
  sortRank?: number;
}

/**
 * Get all unique domain tags (static list, not from DB)
 */
export function getAllDomains(): DomainTag[] {
  return ["Product", "Engineering", "Design", "Growth", "Founder", "AI"];
}

/**
 * Filter mentors by domains and search query (client-side filtering)
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
