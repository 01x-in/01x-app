import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { parseProjectRow } from "@/lib/projects-db";
import type { Project } from "@/types/projects";

/**
 * GET /api/v1/projects/featured
 * Get featured projects for the homepage
 *
 * Only returns published projects from stage 'one' or 'x'
 * Sorted by: featured first (manual override), then most upvoted, then most recent
 *
 * Query params:
 * - limit: number (default 9)
 * - memberId: string (optional, for checking upvote status)
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "9");
    const memberId = searchParams.get("memberId") || undefined;

    // Fetch featured projects
    // Must be published, stage one or x, and visibility public
    const { results } = await db
      .prepare(`
        SELECT * FROM projects
        WHERE published = 1
          AND stage IN ('one', 'x')
          AND visibility = 'public'
        ORDER BY
          is_featured DESC,
          featured_rank ASC,
          upvotes_count DESC,
          created_at DESC
        LIMIT ?1
      `)
      .bind(limit)
      .all();

    const projects = results.map(parseProjectRow);

    // Fetch relations for each project
    const projectsWithRelations = await Promise.all(
      projects.map(async (project: Project) => {
        const relations: Record<string, unknown> = { ...project };

        // Fetch creator (basic info only for homepage)
        const creator = await db
          .prepare("SELECT id, full_name, avatar_url FROM members WHERE id = ?1")
          .bind(project.creatorId)
          .first();
        if (creator) {
          relations.creator = {
            id: creator.id,
            fullName: creator.full_name,
            avatarUrl: creator.avatar_url,
          };
        }

        // Fetch collaborators (co-builders, whether students or mentors)
        const { results: collabRows } = await db
          .prepare(`
            SELECT m.id, m.full_name, m.avatar_url
            FROM project_collaborators pc
            JOIN members m ON m.id = pc.member_id
            WHERE pc.project_id = ?1
            LIMIT 5
          `)
          .bind(project.id)
          .all();
        if (collabRows.length > 0) {
          relations.collaborators = collabRows.map((m: any) => ({
            id: m.id,
            fullName: m.full_name,
            avatarUrl: m.avatar_url,
          }));
        }

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
    });
  } catch (error) {
    console.error("[projects/featured] ❌ GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch featured projects" }, { status: 500 });
  }
}
