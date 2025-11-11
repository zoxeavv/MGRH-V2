#!/bin/bash
# Script pour corriger automatiquement tous les problèmes identifiés

set -e

echo "🔧 Correction automatique des erreurs..."

cd "$(dirname "$0")"

# 1. Corriger session.ts
echo "📝 Correction de session.ts..."
cat > src/lib/auth/session.ts << 'SESSION_EOF'
import { createClient } from "@/lib/supabase/server";
import { crmUsers, organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";

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

    const db = await getDb();
    if (!db) {
      console.warn('Database connection not available');
      return null;
    }

    const userRows = await db
      .select()
      .from(crmUsers)
      .where(eq(crmUsers.id, authUser.id))
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
 * TODO: Implement when organizationMembers table is created
 */
export async function getOrganizationContext(): Promise<OrganizationContext | null> {
  try {
    const user = await getSessionUser();
    if (!user) {
      return null;
    }

    // TODO: Implement organization lookup when organizationMembers table is ready
    // For now, return null
    return null;
  } catch (error) {
    console.error("Error getting organization context:", error);
    return null;
  }
}
SESSION_EOF

# 2. Vérifier que use-toast.ts a "use client"
echo "📝 Vérification de use-toast.ts..."
if ! head -1 src/hooks/use-toast.ts | grep -q '"use client"'; then
  echo "Ajout de 'use client' à use-toast.ts..."
  sed -i '1i"use client";' src/hooks/use-toast.ts
fi

# 3. Vérifier que toaster.tsx a "use client"
echo "📝 Vérification de toaster.tsx..."
if [ -f src/components/ui/toaster.tsx ] && ! head -1 src/components/ui/toaster.tsx | grep -q '"use client"'; then
  echo "Ajout de 'use client' à toaster.tsx..."
  sed -i '1i"use client";' src/components/ui/toaster.tsx
fi

# 4. Vérifier que providers.tsx a "use client"
echo "📝 Vérification de providers.tsx..."
if [ -f src/components/providers.tsx ] && ! head -1 src/components/providers.tsx | grep -q '"use client"'; then
  echo "Ajout de 'use client' à providers.tsx..."
  sed -i '1i"use client";' src/components/providers.tsx
fi

# 5. Nettoyer le cache
echo "🧹 Nettoyage du cache..."
rm -rf .next

echo "✅ Corrections appliquées!"
echo ""
echo "Prochaines étapes:"
echo "1. npm run build"
echo "2. npm run dev"
