import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { parseMemberRow } from "@/lib/projects-db";

/**
 * GET /api/v1/projects/[id]/collaborators
 * Get all collaborators for a project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDB();
    const { id: projectId } = await params;

    // Check if project exists
    const project = await db
      .prepare("SELECT id FROM projects WHERE id = ?1")
      .bind(projectId)
      .first();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch collaborators
    const { results } = await db
      .prepare(`
        SELECT m.*, pc.role, pc.created_at as joined_at
        FROM members m
        JOIN project_collaborators pc ON pc.member_id = m.id
        WHERE pc.project_id = ?1
        ORDER BY pc.created_at ASC
      `)
      .bind(projectId)
      .all();

    const collaborators = results.map((row: Record<string, unknown>) => ({
      ...parseMemberRow(row),
      role: row.role,
      joinedAt: row.joined_at,
    }));

    return NextResponse.json({ collaborators });
  } catch (error) {
    console.error("[projects/[id]/collaborators] ❌ GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch collaborators" }, { status: 500 });
  }
}

/**
 * POST /api/v1/projects/[id]/collaborators
 * Add a collaborator to a project
 *
 * Body:
 * - memberId: string (required)
 * - role: string (optional, default 'collaborator')
 * - requesterId: string (required, must be project creator)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDB();
    const { id: projectId } = await params;
    const body = await request.json();
    const { memberId, role = 'collaborator', requesterId } = body;

    if (!memberId || !requesterId) {
      return NextResponse.json(
        { error: "Missing required fields: memberId, requesterId" },
        { status: 400 }
      );
    }

    // Check if project exists and requester is the creator
    const project = await db
      .prepare("SELECT creator_id FROM projects WHERE id = ?1")
      .bind(projectId)
      .first();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.creator_id !== requesterId) {
      return NextResponse.json(
        { error: "Only project creator can add collaborators" },
        { status: 403 }
      );
    }

    // Check if member exists
    const member = await db
      .prepare("SELECT id FROM members WHERE id = ?1")
      .bind(memberId)
      .first();

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Check if already a collaborator
    const existing = await db
      .prepare("SELECT id FROM project_collaborators WHERE project_id = ?1 AND member_id = ?2")
      .bind(projectId, memberId)
      .first();

    if (existing) {
      return NextResponse.json({ error: "Member is already a collaborator" }, { status: 409 });
    }

    // Add collaborator
    await db
      .prepare("INSERT INTO project_collaborators (project_id, member_id, role) VALUES (?1, ?2, ?3)")
      .bind(projectId, memberId, role)
      .run();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[projects/[id]/collaborators] ❌ POST Error:", error);
    return NextResponse.json({ error: "Failed to add collaborator" }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/projects/[id]/collaborators
 * Remove a collaborator from a project
 *
 * Query params:
 * - memberId: string (required)
 * - requesterId: string (required, must be project creator)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDB();
    const { id: projectId } = await params;
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    const requesterId = searchParams.get("requesterId");

    if (!memberId || !requesterId) {
      return NextResponse.json(
        { error: "Missing required query params: memberId, requesterId" },
        { status: 400 }
      );
    }

    // Check if project exists and requester is the creator
    const project = await db
      .prepare("SELECT creator_id FROM projects WHERE id = ?1")
      .bind(projectId)
      .first();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.creator_id !== requesterId) {
      return NextResponse.json(
        { error: "Only project creator can remove collaborators" },
        { status: 403 }
      );
    }

    // Remove collaborator
    await db
      .prepare("DELETE FROM project_collaborators WHERE project_id = ?1 AND member_id = ?2")
      .bind(projectId, memberId)
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[projects/[id]/collaborators] ❌ DELETE Error:", error);
    return NextResponse.json({ error: "Failed to remove collaborator" }, { status: 500 });
  }
}
