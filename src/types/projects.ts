// ============================================================================
// Projects System Types
// ============================================================================

// Enums
export type ProjectStage = 'zero' | 'one' | 'x';
export type ProjectVisibility = 'private' | 'collaborators' | 'public';
export type CohortStatus = 'upcoming' | 'active' | 'completed' | 'archived';

// ============================================================================
// Member Types
// ============================================================================

export interface Member {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Basic Info
  fullName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;

  // Links
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;

  // Profile
  techStack?: string[];
  areasOfInterest?: string[];

  // Status
  isActive: boolean;
}

export interface MemberInput {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  mentorId?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  techStack?: string[];
  areasOfInterest?: string[];
}

// ============================================================================
// Cohort Types
// ============================================================================

export interface Cohort {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Basic Info
  name: string;
  tagline?: string;
  description?: string;

  // Timing
  startDate?: string;
  endDate?: string;

  // Status
  status: CohortStatus;
  isActive: boolean;

  // Meta
  cohortNumber?: number;
  maxMembers?: number;

  // Image
  coverImageUrl?: string;
}

export interface CohortInput {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: CohortStatus;
  cohortNumber?: number;
  maxMembers?: number;
  coverImageUrl?: string;
}

// ============================================================================
// Project Types
// ============================================================================

export interface ProjectMetrics {
  users?: number;
  revenue?: number;
  growthPercentage?: number;
  [key: string]: number | undefined;
}

export interface ProjectTestimonial {
  author: string;
  role?: string;
  content: string;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Basic Info
  title: string;
  tagline?: string;
  description?: string;

  // Stage & Visibility
  stage: ProjectStage;
  visibility: ProjectVisibility;
  published: boolean;

  // Creator
  creatorId: string;

  // Associations
  cohortId?: string;

  // Media
  coverImageUrl?: string;
  demoVideoUrl?: string;
  productUrl?: string;
  githubUrl?: string;
  screenshots?: string[];

  // Technical
  techStack?: string[];
  problemStatement?: string;
  targetAudience?: string;
  onePager?: string; // Markdown

  // Scale Metrics (only for stage 'x')
  metrics?: ProjectMetrics;
  testimonials?: ProjectTestimonial[];
  launchDate?: string;

  // Community Features
  upvotesCount: number;
  commentsCount: number;

  // Flags
  requestFeedback: boolean;
  lookingForCollaborators: boolean;
  isFeatured: boolean;

  // Ranking
  featuredRank?: number;

  // Showcase
  founderQuote?: string; // Short founder story shown on login page
}

export interface ProjectInput {
  id: string;
  title: string;
  tagline?: string;
  description?: string;
  stage?: ProjectStage;
  visibility?: ProjectVisibility;
  published?: boolean;
  creatorId: string;
  cohortId?: string;
  coverImageUrl?: string;
  demoVideoUrl?: string;
  productUrl?: string;
  githubUrl?: string;
  screenshots?: string[];
  techStack?: string[];
  problemStatement?: string;
  targetAudience?: string;
  onePager?: string;
  metrics?: ProjectMetrics;
  testimonials?: ProjectTestimonial[];
  launchDate?: string;
  requestFeedback?: boolean;
  lookingForCollaborators?: boolean;
  isFeatured?: boolean;
  featuredRank?: number;
  founderQuote?: string;
}

export interface ProjectUpdate {
  title?: string;
  tagline?: string;
  description?: string;
  stage?: ProjectStage;
  visibility?: ProjectVisibility;
  published?: boolean;
  cohortId?: string;
  coverImageUrl?: string;
  demoVideoUrl?: string;
  productUrl?: string;
  githubUrl?: string;
  screenshots?: string[];
  techStack?: string[];
  problemStatement?: string;
  targetAudience?: string;
  onePager?: string;
  metrics?: ProjectMetrics;
  testimonials?: ProjectTestimonial[];
  launchDate?: string;
  requestFeedback?: boolean;
  lookingForCollaborators?: boolean;
  isFeatured?: boolean;
  featuredRank?: number;
  founderQuote?: string;
}

// ============================================================================
// Project with Relations (for API responses)
// ============================================================================

export interface ProjectWithRelations extends Project {
  creator?: Member;
  cohort?: Cohort;
  collaborators?: Member[];
  mentors?: Mentor[];
  hasUpvoted?: boolean; // If current user has upvoted
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
}

// ============================================================================
// Collaborator Types
// ============================================================================

export interface ProjectCollaborator {
  id: number;
  createdAt: string;
  projectId: string;
  memberId: string;
  role: string;
}

export interface ProjectCollaboratorInput {
  projectId: string;
  memberId: string;
  role?: string;
}

// ============================================================================
// Project Mentor Types
// ============================================================================

export interface ProjectMentor {
  id: number;
  createdAt: string;
  projectId: string;
  mentorId: string;
}

export interface ProjectMentorInput {
  projectId: string;
  mentorId: string;
}

// ============================================================================
// Upvote Types
// ============================================================================

export interface ProjectUpvote {
  id: number;
  createdAt: string;
  projectId: string;
  memberId: string;
}

export interface ProjectUpvoteInput {
  projectId: string;
  memberId: string;
}

// ============================================================================
// Comment Types
// ============================================================================

export interface ProjectComment {
  id: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  memberId: string;
  content: string;
  parentCommentId?: string;
  isDeleted: boolean;
}

export interface ProjectCommentInput {
  id: string;
  projectId: string;
  memberId: string;
  content: string;
  parentCommentId?: string;
}

export interface ProjectCommentWithMember extends ProjectComment {
  member?: Member;
  replies?: ProjectCommentWithMember[];
}

// ============================================================================
// Filter & Query Types
// ============================================================================

export interface ProjectFilters {
  stage?: ProjectStage | ProjectStage[];
  visibility?: ProjectVisibility;
  published?: boolean;
  cohortId?: string;
  creatorId?: string;
  techStack?: string[];
  lookingForCollaborators?: boolean;
  isFeatured?: boolean;
}

export type ProjectSortBy = 'newest' | 'oldest' | 'most_upvoted' | 'most_commented' | 'featured';

export interface ProjectQueryParams extends ProjectFilters {
  sortBy?: ProjectSortBy;
  limit?: number;
  offset?: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ProjectsListResponse {
  projects: ProjectWithRelations[];
  total: number;
  limit: number;
  offset: number;
}

export interface ProjectResponse {
  project: ProjectWithRelations;
}

export interface UpvoteResponse {
  success: boolean;
  upvoted: boolean;
  upvotesCount: number;
}

export interface CommentResponse {
  comment: ProjectCommentWithMember;
}

export interface CommentsListResponse {
  comments: ProjectCommentWithMember[];
  total: number;
}

// ============================================================================
// Validation Rules
// ============================================================================

export const VALIDATION_RULES = {
  // Stage zero cannot be public or published
  canPublish: (stage: ProjectStage): boolean => {
    return stage === 'one' || stage === 'x';
  },

  // Stage zero cannot have public visibility
  canBePublic: (stage: ProjectStage): boolean => {
    return stage === 'one' || stage === 'x';
  },

  // Validate visibility for stage
  isValidVisibility: (stage: ProjectStage, visibility: ProjectVisibility): boolean => {
    if (stage === 'zero' && visibility === 'public') {
      return false;
    }
    return true;
  },

  // Validate published for stage
  isValidPublished: (stage: ProjectStage, published: boolean): boolean => {
    if (published && stage === 'zero') {
      return false;
    }
    return true;
  },

  // Can transition from one stage to another
  canTransitionStage: (from: ProjectStage, to: ProjectStage): boolean => {
    const transitions: Record<ProjectStage, ProjectStage[]> = {
      zero: ['one'],
      one: ['x'],
      x: [], // Cannot transition from scale
    };
    return transitions[from]?.includes(to) ?? false;
  },
};
