# Guide de Prévention des Erreurs

Ce guide résume les 5 erreurs corrigées et comment les éviter à l'avenir.

## ✅ Erreurs Corrigées

### 1. ❌ `Cannot read properties of undefined (reading 'select')`

**Problème**: `db` était `undefined` dans `session.ts` ligne 35.

**Correction**:
- ✅ Modifié `getDb()` pour retourner `null` au lieu de `undefined` en cas d'erreur
- ✅ Ajouté des vérifications `if (!db)` dans `session.ts`
- ✅ Utilisé `crmUsers` au lieu de `users` (ancienne table)

**Fichiers modifiés**:
- `src/lib/db/index.ts` - Retourne `null` au lieu de throw
- `src/lib/auth/session.ts` - Vérifications de null et utilisation de `crmUsers`

### 2. ❌ `useState only works in Client Components`

**Problème**: `useToast` utilisait `useState` sans `"use client"`.

**Correction**:
- ✅ Ajouté `"use client"` en haut de `use-toast.ts`
- ✅ Ajouté `"use client"` en haut de `toaster.tsx`
- ✅ Ajouté `"use client"` en haut de `providers.tsx`

**Fichiers créés/modifiés**:
- `src/hooks/use-toast.ts` - Ajouté `"use client"`
- `src/components/ui/toaster.tsx` - Ajouté `"use client"`
- `src/components/providers.tsx` - Ajouté `"use client"`

### 3. ❌ Utilisation de l'ancienne table `users`

**Problème**: Le code utilisait encore `users` au lieu de `crmUsers`.

**Correction**:
- ✅ Créé `session.ts` avec `crmUsers` au lieu de `users`
- ✅ Tous les imports utilisent maintenant `crmUsers`

**Fichiers créés**:
- `src/lib/auth/session.ts` - Utilise `crmUsers`

### 4. ❌ Gestion d'erreur insuffisante

**Problème**: Les erreurs de DB n'étaient pas gérées gracieusement.

**Correction**:
- ✅ `getDb()` retourne `null` au lieu de throw
- ✅ Ajouté des try-catch dans `session.ts`
- ✅ Créé `safe-db.ts` avec des fonctions sécurisées

**Fichiers créés**:
- `src/lib/db/safe-db.ts` - Fonctions DB sécurisées

### 5. ❌ Erreur TypeScript dans `use-toast.ts`

**Problème**: Type `ToasterToast` manquait `open` et `onOpenChange`.

**Correction**:
- ✅ Ajouté `open?: boolean` et `onOpenChange?: (open: boolean) => void` au type

## 🛡️ Règles de Prévention

### Règle 1: Toujours vérifier `db` avant utilisation

```typescript
// ✅ Bon
const db = await getDb();
if (!db) {
  return null; // ou gérer l'erreur
}
const result = await db.select()...

// ❌ Mauvais
const db = await getDb();
const result = await db.select()... // Peut crasher si db est null
```

### Règle 2: Toujours ajouter `"use client"` aux hooks

```typescript
// ✅ Bon
"use client";
export function useToast() {
  const [state, setState] = useState();
  ...
}

// ❌ Mauvais
export function useToast() {
  const [state, setState] = useState(); // Erreur!
  ...
}
```

### Règle 3: Toujours utiliser `crmUsers`

```typescript
// ✅ Bon
import { crmUsers } from '@/lib/db/schema';
await db.select().from(crmUsers)...

// ❌ Mauvais
import { users } from '@/lib/db/schema'; // Table n'existe plus
```

### Règle 4: Gérer les erreurs gracieusement

```typescript
// ✅ Bon
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Error:', error);
  return null; // Valeur par défaut
}

// ❌ Mauvais
const result = await riskyOperation(); // Peut crasher
```

## 🔍 Checklist Avant Commit

- [ ] Tous les fichiers avec hooks ont `"use client"`
- [ ] Tous les appels à `getDb()` sont vérifiés pour null
- [ ] Tous les imports utilisent `crmUsers` et non `users`
- [ ] Les erreurs sont gérées avec try-catch
- [ ] Le build passe: `npm run build`
- [ ] Le typecheck passe: `npm run typecheck`

## 📚 Fichiers de Référence

- `DEBUG_STRATEGY.md` - Stratégie complète de debug
- `src/lib/db/safe-db.ts` - Fonctions DB sécurisées
- `src/lib/auth/session.ts` - Exemple de code sécurisé

## 🚨 En Cas d'Erreur

1. Vérifier les logs de la console
2. Vérifier `.env.local` pour `SUPABASE_DB_URL`
3. Nettoyer: `rm -rf .next node_modules/.cache`
4. Réinstaller: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps`
5. Vérifier le schéma: `npm run db:push`
