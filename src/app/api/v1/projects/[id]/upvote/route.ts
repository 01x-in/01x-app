import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

/**
 * POST /api/v1/projects/[id]/upvote
 * Toggle upvote on a project
 *
 * Body:
 * - memberId: string (required)
 *
 * Returns:
 * - success: boolean
 * - upvoted: boolean (true if upvoted, false if removed)
 * - upvotesCount: number
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDB();
    const { id: projectId } = await params;
    const body = await request.json();
    const { memberId } = body;

    if (!memberId) {
      return NextResponse.json({ error: "Missing memberId" }, { status: 400 });
    }

    // Check if project exists
    const project = await db
      .prepare("SELECT id FROM projects WHERE id = ?1")
      .bind(projectId)
      .first();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if member exists
    const member = await db
      .prepare("SELECT id FROM members WHERE id = ?1")
      .bind(memberId)
      .first();

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Check if upvote already exists
    const existingUpvote = await db
      .prepare("SELECT 1 FROM project_upvotes WHERE project_id = ?1 AND member_id = ?2")
      .bind(projectId, memberId)
      .first();

    let upvoted = false;

    if (existingUpvote) {
      // Remove upvote
      await db
        .prepare("DELETE FROM project_upvotes WHERE project_id = ?1 AND member_id = ?2")
        .bind(projectId, memberId)
        .run();
      upvoted = false;
    } else {
      // Add upvote
      await db
        .prepare("INSERT INTO project_upvotes (project_id, member_id) VALUES (?1, ?2)")
        .bind(projectId, memberId)
        .run();
      upvoted = true;
    }

    // Get updated upvotes count
    const updatedProject = await db
      .prepare("SELECT upvotes_count FROM projects WHERE id = ?1")
      .bind(projectId)
      .first();

    return NextResponse.json({
      success: true,
      upvoted,
      upvotesCount: updatedProject?.upvotes_count || 0,
    });
  } catch (error) {
    console.error("[projects/[id]/upvote] ❌ POST Error:", error);
    return NextResponse.json({ error: "Failed to toggle upvote" }, { status: 500 });
  }
}
