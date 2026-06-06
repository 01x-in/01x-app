import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { parseMemberRow } from "@/lib/projects-db";
import type { MemberInput } from "@/types/projects";

/**
 * GET /api/v1/members
 * List all active members or get a specific member by ID or email
 *
 * Query params:
 * - id: string (optional)
 * - email: string (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    // Single member by ID
    if (id) {
      const member = await db
        .prepare("SELECT * FROM members WHERE id = ?1")
        .bind(id)
        .first();

      if (!member) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
      }

      return NextResponse.json({ member: parseMemberRow(member) });
    }

    // Single member by email
    if (email) {
      const member = await db
        .prepare("SELECT * FROM members WHERE email = ?1")
        .bind(email)
        .first();

      if (!member) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
      }

      return NextResponse.json({ member: parseMemberRow(member) });
    }

    // All active members
    const { results } = await db
      .prepare("SELECT * FROM members WHERE is_active = 1 ORDER BY created_at DESC")
      .all();

    return NextResponse.json({ members: results.map(parseMemberRow) });
  } catch (error) {
    console.error("[members] ❌ GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

/**
 * POST /api/v1/members
 * Create a new member
 */
export async function POST(request: NextRequest) {
  try {
    const db = getDB();
    const body = await request.json();
    const input: MemberInput = body;

    // Validate required fields
    if (!input.id || !input.fullName || !input.email) {
      return NextResponse.json(
        { error: "Missing required fields: id, fullName, email" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await db
      .prepare("SELECT id FROM members WHERE email = ?1")
      .bind(input.email)
      .first();

    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    // Insert member
    await db
      .prepare(`
        INSERT INTO members (
          id, full_name, email, avatar_url, bio, location,
          linkedin_url, github_url, website_url,
          tech_stack, areas_of_interest
        ) VALUES (
          ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11
        )
      `)
      .bind(
        input.id,
        input.fullName,
        input.email,
        input.avatarUrl || null,
        input.bio || null,
        input.location || null,
        input.linkedinUrl || null,
        input.githubUrl || null,
        input.websiteUrl || null,
        input.techStack ? JSON.stringify(input.techStack) : null,
        input.areasOfInterest ? JSON.stringify(input.areasOfInterest) : null
      )
      .run();

    // Fetch the created member
    const member = await db.prepare("SELECT * FROM members WHERE id = ?1").bind(input.id).first();

    if (!member) {
      return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
    }

    return NextResponse.json({ member: parseMemberRow(member) }, { status: 201 });
  } catch (error) {
    console.error("[members] ❌ POST Error:", error);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
