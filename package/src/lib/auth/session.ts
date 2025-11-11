import { createClient } from "@/lib/supabase/server";
import { users, organizationMembers, organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { firstOrError } from "@/lib/guards";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
};

export type OrganizationContext = {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "member" | "viewer";
};

/**
 * Get the current session user
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return null;
    }

    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, authUser.id))
      .limit(1);

    if (!userRows[0]) {
      return null;
    }

    return {
      id: userRows[0].id,
      email: userRows[0].email,
      fullName: userRows[0].fullName ?? null,
      avatarUrl: userRows[0].avatarUrl ?? null,
    };
  } catch (error) {
    console.error("Error getting session user:", error);
    return null;
  }
}

/**
 * Get the current user's organization context
 */
export async function getOrganizationContext(): Promise<OrganizationContext | null> {
  try {
    const user = await getSessionUser();
    if (!user) {
      return null;
    }

    const memberRows = await db
      .select({
        organizationId: organizationMembers.organizationId,
        role: organizationMembers.role,
        organizationName: organizations.name,
        organizationSlug: organizations.slug,
        organizationIdFull: organizations.id,
      })
      .from(organizationMembers)
      .innerJoin(
        organizations,
        eq(organizationMembers.organizationId, organizations.id)
      )
      .where(eq(organizationMembers.userId, user.id))
      .limit(1);

    if (!memberRows[0]) {
      return null;
    }

    const member = memberRows[0];
    return {
      id: member.organizationIdFull,
      name: member.organizationName,
      slug: member.organizationSlug,
      role: member.role as "owner" | "member" | "viewer",
    };
  } catch (error) {
    console.error("Error getting organization context:", error);
    return null;
  }
}
