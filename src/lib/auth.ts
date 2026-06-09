import { auth } from '@clerk/nextjs/server'
import { getDB } from './db'

export interface AppUser {
    id: string
    clerkId: string
    email: string
    fullName: string
    avatarUrl: string | null
    isAdmin: boolean
    memberId: string | null   // set → this user is a member/student
    mentorId: string | null   // set → this user is a mentor
    inboxEmail: string | null // assigned @01x.in inbox address (null if not provisioned)
    isActive: boolean
    createdAt: string
    updatedAt: string
}

/**
 * Get the current authenticated platform user from D1.
 * Returns null if not signed in or no user record exists.
 */
export async function getCurrentUser(): Promise<AppUser | null> {
    const { userId } = await auth()
    if (!userId) return null

    const db = getDB()
    const row = await db
        .prepare('SELECT * FROM users WHERE clerk_id = ?1 AND is_active = 1')
        .bind(userId)
        .first()

    if (!row) return null

    return {
        id: row.id as string,
        clerkId: row.clerk_id as string,
        email: row.email as string,
        fullName: row.full_name as string,
        avatarUrl: (row.avatar_url as string) || null,
        isAdmin: row.is_admin === 1,
        memberId: (row.member_id as string) || null,
        mentorId: (row.mentor_id as string) || null,
        inboxEmail: (row.inbox_email as string) || null,
        isActive: row.is_active === 1,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
    }
}

/**
 * Require the current user to be authenticated and have an active account.
 * Throws if not found.
 */
export async function requireUser(): Promise<AppUser> {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error('Unauthorized: No active user found')
    }
    return user
}

/**
 * Require the current user to be an admin.
 * Throws if not authenticated or not an admin.
 */
export async function requireAdmin(): Promise<AppUser> {
    const user = await requireUser()
    if (!user.isAdmin) {
        throw new Error('Forbidden: Admin access required')
    }
    return user
}
