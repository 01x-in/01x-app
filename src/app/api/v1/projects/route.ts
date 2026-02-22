import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import {
  parseProjectRow,
  parseMemberRow,
  parseCohortRow,
  validateProjectVisibility,
  validateProjectPublished,
  buildProjectsListQuery,
} from "@/lib/projects-db";
import type { Project, ProjectInput, ProjectQueryParams } from "@/types/projects";

/**
 * GET /api/v1/projects
 * List projects with filters and pagination
 *
 * Query params:
 * - stage: 'zero' | 'one' | 'x' (can be comma-separated for multiple)
 * - visibility: 'private' | 'collaborators' | 'public'
 * - published: '1' | '0'
 * - cohortId: string
 * - creatorId: string
 * - lookingForCollaborators: '1' | '0'
 * - isFeatured: '1' | '0'
 * - sortBy: 'newest' | 'oldest' | 'most_upvoted' | 'most_commented' | 'featured'
 * - limit: number (default 20)
 * - offset: number (default 0)
 * - memberId: string (for checking upvote status)
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const stageParam = searchParams.get("stage");
    const stage = stageParam ? stageParam.split(",") : undefined;
    const visibility = searchParams.get("visibility") || undefined;
    const publishedParam = searchParams.get("published");
    const published = publishedParam ? publishedParam === "1" : undefined;
    const cohortId = searchParams.get("cohortId") || undefined;
    const creatorId = searchParams.get("creatorId") || undefined;
    const lookingForCollaboratorsParam = searchParams.get("lookingForCollaborators");
    const lookingForCollaborators = lookingForCollaboratorsParam
      ? lookingForCollaboratorsParam === "1"
      : undefined;
    const isFeaturedParam = searchParams.get("isFeatured");
    const isFeatured = isFeaturedParam ? isFeaturedParam === "1" : undefined;
    const sortBy = searchParams.get("sortBy") || "newest";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const memberId = searchParams.get("memberId") || undefined;

    // Build query
    const { query, bindings } = buildProjectsListQuery({
      stage,
      visibility,
      published,
      cohortId,
      creatorId,
      lookingForCollaborators,
      isFeatured,
      sortBy,
      limit,
      offset,
    });

    // Execute query
    const { results } = await db.prepare(query).bind(...bindings).all();
    const projects = results.map(parseProjectRow);

    // Get total count for pagination
    const { query: countQuery, bindings: countBindings } = buildProjectsListQuery({
      stage,
      visibility,
      published,
      cohortId,
      creatorId,
      lookingForCollaborators,
      isFeatured,
    });
    const countQueryModified = countQuery.replace("SELECT * FROM projects", "SELECT COUNT(*) as count FROM projects");
    const countResult = await db.prepare(countQueryModified).bind(...countBindings).first();
    const total = (countResult?.count as number) || 0;

    // Fetch relations for each project
    const projectsWithRelations = await Promise.all(
      projects.map(async (project) => {
        const relations: any = { ...project };

        // Fetch creator
        const creator = await db
          .prepare("SELECT * FROM members WHERE id = ?1")
          .bind(project.creatorId)
          .first();
        if (creator) {
          relations.creator = parseMemberRow(creator);
        }

        // Fetch cohort if exists
        if (project.cohortId) {
          const cohort = await db
            .prepare("SELECT * FROM cohorts WHERE id = ?1")
            .bind(project.cohortId)
            .first();
          if (cohort) {
            relations.cohort = parseCohortRow(cohort);
          }
        }

        // Fetch collaborators
        const { results: collaborators } = await db
          .prepare(`
            SELECT m.* FROM members m
            JOIN project_collaborators pc ON pc.member_id = m.id
            WHERE pc.project_id = ?1
          `)
          .bind(project.id)
          .all();
        relations.collaborators = collaborators.map(parseMemberRow);

        // Fetch mentors
        const { results: mentors } = await db
          .prepare(`
            SELECT m.id, m.name, m.title, m.image_src as avatarUrl
            FROM mentors m
            JOIN project_mentors pm ON pm.mentor_id = m.id
            WHERE pm.project_id = ?1
          `)
          .bind(project.id)
          .all();
        relations.mentors = mentors.map((m) => ({
          id: m.id,
          name: m.name,
          title: m.title,
          avatarUrl: m.avatarUrl,
        }));

        // Check if current member has upvoted
        if (memberId) {
          const upvote = await db
            .prepare("SELECT id FROM project_upvotes WHERE project_id = ?1 AND member_id = ?2")
            .bind(project.id, memberId)
            .first();
          relations.hasUpvoted = !!upvote;
        }

        return relations;
      })
    );

    return NextResponse.json({
      projects: projectsWithRelations,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[projects] ❌ GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

/**
 * POST /api/v1/projects
 * Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    const db = getDB();
    const body = await request.json();
    const input: ProjectInput = body;

    // Validate required fields
    if (!input.id || !input.title || !input.creatorId) {
      return NextResponse.json(
        { error: "Missing required fields: id, title, creatorId" },
        { status: 400 }
      );
    }

    // Validate stage, visibility, published rules
    const stage = input.stage || 'zero';
    const visibility = input.visibility || 'private';
    const published = input.published || false;

    const visibilityValidation = validateProjectVisibility(stage, visibility);
    if (!visibilityValidation.valid) {
      return NextResponse.json({ error: visibilityValidation.error }, { status: 400 });
    }

    const publishedValidation = validateProjectPublished(stage, published);
    if (!publishedValidation.valid) {
      return NextResponse.json({ error: publishedValidation.error }, { status: 400 });
    }

    // Insert project
    await db
      .prepare(`
        INSERT INTO projects (
          id, title, tagline, description, stage, visibility, published,
          creator_id, cohort_id, cover_image_url, demo_video_url, product_url,
          github_url, screenshots, tech_stack, problem_statement, target_audience,
          one_pager, metrics, testimonials, launch_date, request_feedback,
          looking_for_collaborators, is_featured, featured_rank
        ) VALUES (
          ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15,
          ?16, ?17, ?18, ?19, ?20, ?21, ?22, ?23, ?24, ?25
        )
      `)
      .bind(
        input.id,
        input.title,
        input.tagline || null,
        input.description || null,
        stage,
        visibility,
        published ? 1 : 0,
        input.creatorId,
        input.cohortId || null,
        input.coverImageUrl || null,
        input.demoVideoUrl || null,
        input.productUrl || null,
        input.githubUrl || null,
        input.screenshots ? JSON.stringify(input.screenshots) : null,
        input.techStack ? JSON.stringify(input.techStack) : null,
        input.problemStatement || null,
        input.targetAudience || null,
        input.onePager || null,
        input.metrics ? JSON.stringify(input.metrics) : null,
        input.testimonials ? JSON.stringify(input.testimonials) : null,
        input.launchDate || null,
        input.requestFeedback ? 1 : 0,
        input.lookingForCollaborators ? 1 : 0,
        input.isFeatured ? 1 : 0,
        input.featuredRank || 999
      )
      .run();

    // Fetch the created project
    const project = await db.prepare("SELECT * FROM projects WHERE id = ?1").bind(input.id).first();

    if (!project) {
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }

    return NextResponse.json({ project: parseProjectRow(project) }, { status: 201 });
  } catch (error) {
    console.error("[projects] ❌ POST Error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
