"use server";

import { db } from "@/lib/db";
import { users, organizations, organizationMembers } from "@/lib/db/schema";
import { firstOrError, normalizeString } from "@/lib/guards";

export async function registerUser(data: {
  userId: string;
  email: string;
  name: string;
}) {
  try {
    // Create user record
    await db.insert(users).values({
      id: data.userId,
      email: normalizeString(data.email),
      fullName: normalizeString(data.name),
    });

    // Create default organization
    const orgSlug = data.email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "-") ?? "org";
    const orgRows = await db
      .insert(organizations)
      .values({
        name: normalizeString(data.name) + "'s Organization",
        slug: orgSlug,
      })
      .returning();

    const org = firstOrError(orgRows);

    // Add user as owner
    await db.insert(organizationMembers).values({
      organizationId: org.id,
      userId: data.userId,
      role: "owner",
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}
