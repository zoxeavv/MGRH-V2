# Corrections Manuelles - Guide Simple

## 🔧 Correction 1: session.ts

Remplacez le contenu de `src/lib/auth/session.ts` par :

```typescript
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
```

## 🔧 Correction 2: use-toast.ts

Vérifiez que `src/hooks/use-toast.ts` commence par `"use client";`

Si ce n'est pas le cas, ajoutez `"use client";` en première ligne.

## 🔧 Correction 3: toaster.tsx

Vérifiez que `src/components/ui/toaster.tsx` commence par `"use client";`

Si ce n'est pas le cas, ajoutez `"use client";` en première ligne.

## 🔧 Correction 4: providers.tsx

Vérifiez que `src/components/providers.tsx` commence par `"use client";`

Si ce n'est pas le cas, ajoutez `"use client";` en première ligne.

## ✅ Après les corrections

```bash
rm -rf .next
npm run build
npm run dev
```

## 📋 Checklist

- [ ] `session.ts` utilise `getDb()` au lieu de `db`
- [ ] `session.ts` utilise `crmUsers` au lieu de `users`
- [ ] `session.ts` vérifie `if (!db)` avant utilisation
- [ ] `use-toast.ts` a `"use client"` en première ligne
- [ ] `toaster.tsx` a `"use client"` en première ligne
- [ ] `providers.tsx` a `"use client"` en première ligne
