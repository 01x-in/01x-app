import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import {
  parseProjectRow,
  parseMemberRow,
  parseCohortRow,
  validateProjectVisibility,
  validateProjectPublished,
  validateStageTransition,
} from "@/lib/projects-db";
import type { ProjectUpdate } from "@/types/projects";

/**
 * GET /api/v1/projects/[id]
 * Get a single project by ID with all relations
 *
 * Query params:
 * - memberId: string (for checking upvote status and access)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId") || undefined;

    // Fetch project
    const projectRow = await db
      .prepare("SELECT * FROM projects WHERE id = ?1")
      .bind(id)
      .first();

    if (!projectRow) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const project = parseProjectRow(projectRow);

    // Check visibility permissions
    // If not public/published, only creator and collaborators can view
    if (!(project.visibility === 'public' && project.published)) {
      if (!memberId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Check if member is creator
      if (project.creatorId !== memberId) {
        // Check if member is a collaborator
        const collaborator = await db
          .prepare("SELECT 1 FROM project_collaborators WHERE project_id = ?1 AND member_id = ?2")
          .bind(id, memberId)
          .first();

        if (!collaborator) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }

    // Build response with relations
    const response: any = { ...project };

    // Fetch creator
    const creator = await db
      .prepare("SELECT * FROM members WHERE id = ?1")
      .bind(project.creatorId)
      .first();
    if (creator) {
      response.creator = parseMemberRow(creator);
    }

    // Fetch cohort if exists
    if (project.cohortId) {
      const cohort = await db
        .prepare("SELECT * FROM cohorts WHERE id = ?1")
        .bind(project.cohortId)
        .first();
      if (cohort) {
        response.cohort = parseCohortRow(cohort);
      }
    }

    // Fetch collaborators
    const { results: collaborators } = await db
      .prepare(`
        SELECT m.* FROM members m
        JOIN project_collaborators pc ON pc.member_id = m.id
        WHERE pc.project_id = ?1
      `)
      .bind(id)
      .all();
    response.collaborators = collaborators.map(parseMemberRow);

    // Fetch mentors
    const { results: mentors } = await db
      .prepare(`
        SELECT m.id, m.name, m.title, m.image_src as avatarUrl
        FROM mentors m
        JOIN project_mentors pm ON pm.mentor_id = m.id
        WHERE pm.project_id = ?1
      `)
      .bind(id)
      .all();
    response.mentors = mentors.map((m: Record<string, unknown>) => ({
      id: m.id,
      name: m.name,
      title: m.title,
      avatarUrl: m.avatarUrl,
    }));

    // Check if current member has upvoted
    if (memberId) {
      const upvote = await db
        .prepare("SELECT 1 FROM project_upvotes WHERE project_id = ?1 AND member_id = ?2")
        .bind(id, memberId)
        .first();
      response.hasUpvoted = !!upvote;
    }

    return NextResponse.json({ project: response });
  } catch (error) {
    console.error("[projects/[id]] ❌ GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

/**
 * PATCH /api/v1/projects/[id]
 * Update a project
 *
 * Requires memberId in query params for authorization
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json({ error: "Missing memberId" }, { status: 400 });
    }

    // Fetch existing project
    const existingRow = await db
      .prepare("SELECT * FROM projects WHERE id = ?1")
      .bind(id)
      .first();

    if (!existingRow) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const existing = parseProjectRow(existingRow);

    // Check if member is the creator
    if (existing.creatorId !== memberId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse update body
    const body = await request.json();
    const update: ProjectUpdate = body;

    // Validate stage transition if stage is being updated
    if (update.stage && update.stage !== existing.stage) {
      const validation = validateStageTransition(existing.stage, update.stage);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    // Validate visibility
    const newStage = update.stage || existing.stage;
    const newVisibility = update.visibility || existing.visibility;
    const visibilityValidation = validateProjectVisibility(newStage, newVisibility);
    if (!visibilityValidation.valid) {
      return NextResponse.json({ error: visibilityValidation.error }, { status: 400 });
    }

    // Validate published
    const newPublished = update.published !== undefined ? update.published : existing.published;
    const publishedValidation = validateProjectPublished(newStage, newPublished);
    if (!publishedValidation.valid) {
      return NextResponse.json({ error: publishedValidation.error }, { status: 400 });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const bindings: any[] = [];
    let bindIndex = 1;

    if (update.title !== undefined) {
      updates.push(`title = ?${bindIndex++}`);
      bindings.push(update.title);
    }
    if (update.tagline !== undefined) {
      updates.push(`tagline = ?${bindIndex++}`);
      bindings.push(update.tagline || null);
    }
    if (update.description !== undefined) {
      updates.push(`description = ?${bindIndex++}`);
      bindings.push(update.description || null);
    }
    if (update.stage !== undefined) {
      updates.push(`stage = ?${bindIndex++}`);
      bindings.push(update.stage);
    }
    if (update.visibility !== undefined) {
      updates.push(`visibility = ?${bindIndex++}`);
      bindings.push(update.visibility);
    }
    if (update.published !== undefined) {
      updates.push(`published = ?${bindIndex++}`);
      bindings.push(update.published ? 1 : 0);
    }
    if (update.cohortId !== undefined) {
      updates.push(`cohort_id = ?${bindIndex++}`);
      bindings.push(update.cohortId || null);
    }
    if (update.coverImageUrl !== undefined) {
      updates.push(`cover_image_url = ?${bindIndex++}`);
      bindings.push(update.coverImageUrl || null);
    }
    if (update.demoVideoUrl !== undefined) {
      updates.push(`demo_video_url = ?${bindIndex++}`);
      bindings.push(update.demoVideoUrl || null);
    }
    if (update.productUrl !== undefined) {
      updates.push(`product_url = ?${bindIndex++}`);
      bindings.push(update.productUrl || null);
    }
    if (update.githubUrl !== undefined) {
      updates.push(`github_url = ?${bindIndex++}`);
      bindings.push(update.githubUrl || null);
    }
    if (update.screenshots !== undefined) {
      updates.push(`screenshots = ?${bindIndex++}`);
      bindings.push(update.screenshots ? JSON.stringify(update.screenshots) : null);
    }
    if (update.techStack !== undefined) {
      updates.push(`tech_stack = ?${bindIndex++}`);
      bindings.push(update.techStack ? JSON.stringify(update.techStack) : null);
    }
    if (update.problemStatement !== undefined) {
      updates.push(`problem_statement = ?${bindIndex++}`);
      bindings.push(update.problemStatement || null);
    }
    if (update.targetAudience !== undefined) {
      updates.push(`target_audience = ?${bindIndex++}`);
      bindings.push(update.targetAudience || null);
    }
    if (update.onePager !== undefined) {
      updates.push(`one_pager = ?${bindIndex++}`);
      bindings.push(update.onePager || null);
    }
    if (update.metrics !== undefined) {
      updates.push(`metrics = ?${bindIndex++}`);
      bindings.push(update.metrics ? JSON.stringify(update.metrics) : null);
    }
    if (update.testimonials !== undefined) {
      updates.push(`testimonials = ?${bindIndex++}`);
      bindings.push(update.testimonials ? JSON.stringify(update.testimonials) : null);
    }
    if (update.launchDate !== undefined) {
      updates.push(`launch_date = ?${bindIndex++}`);
      bindings.push(update.launchDate || null);
    }
    if (update.requestFeedback !== undefined) {
      updates.push(`request_feedback = ?${bindIndex++}`);
      bindings.push(update.requestFeedback ? 1 : 0);
    }
    if (update.lookingForCollaborators !== undefined) {
      updates.push(`looking_for_collaborators = ?${bindIndex++}`);
      bindings.push(update.lookingForCollaborators ? 1 : 0);
    }
    if (update.isFeatured !== undefined) {
      updates.push(`is_featured = ?${bindIndex++}`);
      bindings.push(update.isFeatured ? 1 : 0);
    }
    if (update.featuredRank !== undefined) {
      updates.push(`featured_rank = ?${bindIndex++}`);
      bindings.push(update.featuredRank);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    // Add project ID as last binding
    bindings.push(id);

    // Execute update
    await db
      .prepare(`UPDATE projects SET ${updates.join(", ")} WHERE id = ?${bindIndex}`)
      .bind(...bindings)
      .run();

    // Fetch updated project
    const updatedRow = await db
      .prepare("SELECT * FROM projects WHERE id = ?1")
      .bind(id)
      .first();

    if (!updatedRow) {
      return NextResponse.json({ error: "Failed to fetch updated project" }, { status: 500 });
    }

    return NextResponse.json({ project: parseProjectRow(updatedRow) });
  } catch (error) {
    console.error("[projects/[id]] ❌ PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/projects/[id]
 * Delete a project
 *
 * Requires memberId in query params for authorization
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return NextResponse.json({ error: "Missing memberId" }, { status: 400 });
    }

    // Fetch existing project
    const existingRow = await db
      .prepare("SELECT * FROM projects WHERE id = ?1")
      .bind(id)
      .first();

    if (!existingRow) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const existing = parseProjectRow(existingRow);

    // Check if member is the creator
    if (existing.creatorId !== memberId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete project (cascade will handle relations)
    await db.prepare("DELETE FROM projects WHERE id = ?1").bind(id).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[projects/[id]] ❌ DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
