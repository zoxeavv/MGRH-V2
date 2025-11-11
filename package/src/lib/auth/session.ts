// Session management utilities
// Handles user session and organization context

import { getDb } from '@/lib/db';
import { crmUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface SessionUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
}

interface AuthUser {
  id: string;
  email?: string;
}

/**
 * Get session user from database
 * Returns null if user not found or database error occurs
 */
export async function getSessionUser(authUser: AuthUser | null): Promise<SessionUser | null> {
  if (!authUser?.id) {
    return null;
  }

  try {
    const db = await getDb();
    
    // Check if db is valid
    if (!db) {
      console.warn('Database connection not available');
      return null;
    }

    const userRows = await db
      .select()
      .from(crmUsers)
      .where(eq(crmUsers.id, authUser.id))
      .limit(1);

    if (userRows.length === 0) {
      return null;
    }

    const user = userRows[0];
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
    };
  } catch (error) {
    console.error('Error getting session user:', error);
    return null;
  }
}

/**
 * Get organization context for the current user
 * Returns null if user not found or database error occurs
 */
export async function getOrganizationContext(authUser: AuthUser | null): Promise<{ user: SessionUser | null; organizationId: string | null }> {
  const user = await getSessionUser(authUser);
  
  // TODO: Implement organization lookup when organizations table is ready
  return {
    user,
    organizationId: null,
  };
}
