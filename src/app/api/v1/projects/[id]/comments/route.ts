import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { parseProjectCommentRow, parseMemberRow } from "@/lib/projects-db";
import type { ProjectComment, ProjectCommentInput, ProjectCommentWithMember } from "@/types/projects";

/**
 * GET /api/v1/projects/[id]/comments
 * Get all comments for a project
 *
 * Returns comments in a nested structure with replies
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

    // Fetch all comments for the project (not deleted)
    const { results } = await db
      .prepare(`
        SELECT * FROM project_comments
        WHERE project_id = ?1 AND is_deleted = 0
        ORDER BY created_at ASC
      `)
      .bind(projectId)
      .all();

    const comments: ProjectComment[] = results.map(parseProjectCommentRow);

    // Fetch member data for all comments
    const memberIds = [...new Set(comments.map((c) => c.memberId))];
    const members: Record<string, any> = {};

    for (const memberId of memberIds) {
      const memberRow = await db
        .prepare("SELECT * FROM members WHERE id = ?1")
        .bind(memberId)
        .first();
      if (memberRow) {
        members[memberId] = parseMemberRow(memberRow);
      }
    }

    // Build nested structure
    const commentsMap: Record<string, ProjectCommentWithMember> = {};
    const rootComments: ProjectCommentWithMember[] = [];

    // First pass: create all comment objects with member data
    for (const comment of comments) {
      commentsMap[comment.id] = {
        ...comment,
        member: members[comment.memberId],
        replies: [],
      };
    }

    // Second pass: build tree structure
    for (const comment of comments) {
      const commentWithMember = commentsMap[comment.id];
      if (comment.parentCommentId && commentsMap[comment.parentCommentId]) {
        commentsMap[comment.parentCommentId].replies!.push(commentWithMember);
      } else {
        rootComments.push(commentWithMember);
      }
    }

    return NextResponse.json({
      comments: rootComments,
      total: comments.length,
    });
  } catch (error) {
    console.error("[projects/[id]/comments] ❌ GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

/**
 * POST /api/v1/projects/[id]/comments
 * Create a new comment on a project
 *
 * Body:
 * - id: string (required, comment ID)
 * - memberId: string (required)
 * - content: string (required)
 * - parentCommentId: string (optional, for replies)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDB();
    const { id: projectId } = await params;
    const body = await request.json();
    const input: Omit<ProjectCommentInput, 'projectId'> & { memberId: string } = body;

    if (!input.id || !input.memberId || !input.content) {
      return NextResponse.json(
        { error: "Missing required fields: id, memberId, content" },
        { status: 400 }
      );
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
      .bind(input.memberId)
      .first();

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // If parent comment ID is provided, verify it exists
    if (input.parentCommentId) {
      const parentComment = await db
        .prepare("SELECT id FROM project_comments WHERE id = ?1 AND project_id = ?2")
        .bind(input.parentCommentId, projectId)
        .first();

      if (!parentComment) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
      }
    }

    // Insert comment
    await db
      .prepare(`
        INSERT INTO project_comments (
          id, project_id, member_id, content, parent_comment_id
        ) VALUES (?1, ?2, ?3, ?4, ?5)
      `)
      .bind(
        input.id,
        projectId,
        input.memberId,
        input.content,
        input.parentCommentId || null
      )
      .run();

    // Fetch the created comment
    const commentRow = await db
      .prepare("SELECT * FROM project_comments WHERE id = ?1")
      .bind(input.id)
      .first();

    if (!commentRow) {
      return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }

    const comment = parseProjectCommentRow(commentRow);

    // Fetch member data
    const memberRow = await db
      .prepare("SELECT * FROM members WHERE id = ?1")
      .bind(comment.memberId)
      .first();

    const commentWithMember: ProjectCommentWithMember = {
      ...comment,
      member: memberRow ? parseMemberRow(memberRow) : undefined,
      replies: [],
    };

    return NextResponse.json({ comment: commentWithMember }, { status: 201 });
  } catch (error) {
    console.error("[projects/[id]/comments] ❌ POST Error:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
