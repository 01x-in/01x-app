/**
 * Database helper functions for Projects system
 * Handles parsing D1 rows into typed objects
 */

import type {
  Member,
  Cohort,
  Project,
  ProjectComment,
  ProjectCollaborator,
  ProjectMentor,
  ProjectUpvote,
  ProjectWithRelations,
  ProjectCommentWithMember,
} from "@/types/projects";

// ============================================================================
// Row Parsers
// ============================================================================

export function parseMemberRow(row: Record<string, unknown>): Member {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    fullName: row.full_name as string,
    email: row.email as string,
    avatarUrl: row.avatar_url as string | undefined,
    bio: row.bio as string | undefined,
    location: row.location as string | undefined,
    memberType: row.member_type as 'student' | 'mentor' | 'both',
    mentorId: row.mentor_id as string | undefined,
    linkedinUrl: row.linkedin_url as string | undefined,
    githubUrl: row.github_url as string | undefined,
    websiteUrl: row.website_url as string | undefined,
    techStack: row.tech_stack ? JSON.parse(row.tech_stack as string) : undefined,
    areasOfInterest: row.areas_of_interest ? JSON.parse(row.areas_of_interest as string) : undefined,
    isActive: row.is_active === 1,
  };
}

export function parseCohortRow(row: Record<string, unknown>): Cohort {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    name: row.name as string,
    tagline: row.tagline as string | undefined,
    description: row.description as string | undefined,
    startDate: row.start_date as string | undefined,
    endDate: row.end_date as string | undefined,
    status: row.status as 'upcoming' | 'active' | 'completed' | 'archived',
    isActive: row.is_active === 1,
    cohortNumber: row.cohort_number as number | undefined,
    maxMembers: row.max_members as number | undefined,
    coverImageUrl: row.cover_image_url as string | undefined,
  };
}

export function parseProjectRow(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    title: row.title as string,
    tagline: row.tagline as string | undefined,
    description: row.description as string | undefined,
    stage: row.stage as 'zero' | 'one' | 'x',
    visibility: row.visibility as 'private' | 'collaborators' | 'public',
    published: row.published === 1,
    creatorId: row.creator_id as string,
    cohortId: row.cohort_id as string | undefined,
    coverImageUrl: row.cover_image_url as string | undefined,
    demoVideoUrl: row.demo_video_url as string | undefined,
    productUrl: row.product_url as string | undefined,
    githubUrl: row.github_url as string | undefined,
    screenshots: row.screenshots ? JSON.parse(row.screenshots as string) : undefined,
    techStack: row.tech_stack ? JSON.parse(row.tech_stack as string) : undefined,
    problemStatement: row.problem_statement as string | undefined,
    targetAudience: row.target_audience as string | undefined,
    onePager: row.one_pager as string | undefined,
    metrics: row.metrics ? JSON.parse(row.metrics as string) : undefined,
    testimonials: row.testimonials ? JSON.parse(row.testimonials as string) : undefined,
    launchDate: row.launch_date as string | undefined,
    upvotesCount: row.upvotes_count as number,
    commentsCount: row.comments_count as number,
    requestFeedback: row.request_feedback === 1,
    lookingForCollaborators: row.looking_for_collaborators === 1,
    isFeatured: row.is_featured === 1,
    featuredRank: row.featured_rank as number | undefined,
    founderQuote: row.founder_quote as string | undefined,
  };
}

export function parseProjectCommentRow(row: Record<string, unknown>): ProjectComment {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    projectId: row.project_id as string,
    memberId: row.member_id as string,
    content: row.content as string,
    parentCommentId: row.parent_comment_id as string | undefined,
    isDeleted: row.is_deleted === 1,
  };
}

// ============================================================================
// Validation Helpers
// ============================================================================

export function validateProjectVisibility(
  stage: 'zero' | 'one' | 'x',
  visibility: 'private' | 'collaborators' | 'public'
): { valid: boolean; error?: string } {
  if (stage === 'zero' && visibility === 'public') {
    return {
      valid: false,
      error: 'Stage zero projects cannot have public visibility',
    };
  }
  return { valid: true };
}

export function validateProjectPublished(
  stage: 'zero' | 'one' | 'x',
  published: boolean
): { valid: boolean; error?: string } {
  if (published && stage === 'zero') {
    return {
      valid: false,
      error: 'Stage zero projects cannot be published',
    };
  }
  return { valid: true };
}

export function validateStageTransition(
  fromStage: 'zero' | 'one' | 'x',
  toStage: 'zero' | 'one' | 'x'
): { valid: boolean; error?: string } {
  const validTransitions: Record<string, string[]> = {
    zero: ['one'],
    one: ['x'],
    x: [],
  };

  if (!validTransitions[fromStage]?.includes(toStage)) {
    return {
      valid: false,
      error: `Cannot transition from stage ${fromStage} to ${toStage}`,
    };
  }

  return { valid: true };
}

// ============================================================================
// Query Builders
// ============================================================================

export function buildProjectsListQuery(filters: {
  stage?: string | string[];
  visibility?: string;
  published?: boolean;
  cohortId?: string;
  creatorId?: string;
  lookingForCollaborators?: boolean;
  isFeatured?: boolean;
  techStack?: string[];
  sortBy?: string;
  limit?: number;
  offset?: number;
}): { query: string; bindings: unknown[] } {
  const conditions: string[] = [];
  const bindings: unknown[] = [];
  let bindIndex = 1;

  // Stage filter
  if (filters.stage) {
    if (Array.isArray(filters.stage)) {
      const placeholders = filters.stage.map(() => `?${bindIndex++}`).join(', ');
      conditions.push(`stage IN (${placeholders})`);
      bindings.push(...filters.stage);
    } else {
      conditions.push(`stage = ?${bindIndex++}`);
      bindings.push(filters.stage);
    }
  }

  // Visibility filter
  if (filters.visibility) {
    conditions.push(`visibility = ?${bindIndex++}`);
    bindings.push(filters.visibility);
  }

  // Published filter
  if (filters.published !== undefined) {
    conditions.push(`published = ?${bindIndex++}`);
    bindings.push(filters.published ? 1 : 0);
  }

  // Cohort filter
  if (filters.cohortId) {
    conditions.push(`cohort_id = ?${bindIndex++}`);
    bindings.push(filters.cohortId);
  }

  // Creator filter
  if (filters.creatorId) {
    conditions.push(`creator_id = ?${bindIndex++}`);
    bindings.push(filters.creatorId);
  }

  // Looking for collaborators
  if (filters.lookingForCollaborators !== undefined) {
    conditions.push(`looking_for_collaborators = ?${bindIndex++}`);
    bindings.push(filters.lookingForCollaborators ? 1 : 0);
  }

  // Featured filter
  if (filters.isFeatured !== undefined) {
    conditions.push(`is_featured = ?${bindIndex++}`);
    bindings.push(filters.isFeatured ? 1 : 0);
  }

  // Build WHERE clause
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Build ORDER BY clause
  let orderBy = 'ORDER BY created_at DESC';
  switch (filters.sortBy) {
    case 'newest':
      orderBy = 'ORDER BY created_at DESC';
      break;
    case 'oldest':
      orderBy = 'ORDER BY created_at ASC';
      break;
    case 'most_upvoted':
      orderBy = 'ORDER BY upvotes_count DESC, created_at DESC';
      break;
    case 'most_commented':
      orderBy = 'ORDER BY comments_count DESC, created_at DESC';
      break;
    case 'featured':
      orderBy = 'ORDER BY is_featured DESC, featured_rank ASC, upvotes_count DESC, created_at DESC';
      break;
  }

  // Build LIMIT/OFFSET
  let limitClause = '';
  if (filters.limit !== undefined) {
    limitClause = `LIMIT ?${bindIndex++}`;
    bindings.push(filters.limit);

    if (filters.offset !== undefined) {
      limitClause += ` OFFSET ?${bindIndex++}`;
      bindings.push(filters.offset);
    }
  }

  const query = `
    SELECT * FROM projects
    ${whereClause}
    ${orderBy}
    ${limitClause}
  `.trim();

  return { query, bindings };
}

// ============================================================================
// Helper to check if member can view project
// ============================================================================

export function canViewProject(
  project: Project,
  memberId?: string
): boolean {
  // Public projects can be viewed by anyone
  if (project.visibility === 'public' && project.published) {
    return true;
  }

  // No member ID means not logged in, can't view private/collaborators
  if (!memberId) {
    return false;
  }

  // Creator can always view their own project
  if (project.creatorId === memberId) {
    return true;
  }

  // For collaborators visibility, need to check if member is a collaborator
  // This would require an additional query, so we return false here
  // and handle it in the API layer
  if (project.visibility === 'collaborators') {
    return false; // Need to check collaborators table
  }

  // Private projects can only be viewed by creator
  return false;
}
