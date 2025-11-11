# Résumé des Corrections - Migration users → crmUsers

## ✅ Problèmes Résolus

### 1. Erreur "Identifier 'users' has already been declared"
**Cause:** Collision de nom avec Supabase `auth.users` et possible doublon dans le code.

**Solution:** 
- ✅ Renommé `users` → `crmUsers` (constante) et `users` → `crm_users` (table)
- ✅ Supprimé toute duplication dans `schema.ts`
- ✅ Créé migration pour renommer la table existante

### 2. Erreur "useState only works in Client Components"
**Cause:** Composants serveur utilisant des hooks React.

**Solution:**
- ✅ Créé `ClientProviders.tsx` pour isoler les providers client
- ✅ Converti `RootLayout` en composant serveur
- ✅ Déplacé `ThemeProvider` et `CssBaseline` dans `ClientProviders`

## 📝 Fichiers Modifiés

### Schema & Database
- ✅ `src/lib/db/schema.ts` - Renommé `users` → `crmUsers`
- ✅ `src/lib/db/index.ts` - Mis à jour fonctions de vérification
- ✅ `src/lib/db/migrate.ts` - Mis à jour pour `crmUsers`
- ✅ `scripts/check-db.ts` - Mis à jour pour `crmUsers`
- ✅ `drizzle/migrations/0001_rename_users_to_crm_users.sql` - Migration créée

### Components
- ✅ `src/app/layout.tsx` - Converti en composant serveur, utilise `ClientProviders`
- ✅ `src/components/layout/ClientProviders.tsx` - Nouveau composant client

### Documentation
- ✅ `DATABASE_SETUP.md` - Mis à jour avec nouveaux noms

## 🚀 Prochaines Étapes

### 1. Installer les packages (si pas déjà fait)
```bash
cd package
npm install drizzle-orm postgres-js
npm install -D drizzle-kit dotenv
```

### 2. Configurer l'environnement
Créer `package/.env.local`:
```env
SUPABASE_DB_URL=postgresql://user:password@host:port/database
```

### 3. Exécuter les migrations

**Option A: Si vous avez déjà une table `users` existante:**
```bash
# Exécuter la migration de renommage
psql $SUPABASE_DB_URL -f drizzle/migrations/0001_rename_users_to_crm_users.sql

# OU utiliser drizzle-kit push pour synchroniser le schema
npm run db:push
```

**Option B: Si vous partez de zéro:**
```bash
# Drizzle-kit créera directement la table crm_users
npm run db:push
```

### 4. Vérifier la base de données
```bash
npx tsx scripts/check-db.ts
```

### 5. Redémarrer le serveur de développement
```bash
rm -rf .next
npm run dev
```

## 🔍 Vérifications

### Vérifier qu'il n'y a plus de doublons
```bash
cd package
grep -r "export const users" src/ --include="*.ts" --include="*.tsx"
# Devrait retourner 0 résultats (ou seulement dans les commentaires)
```

### Vérifier que crmUsers est utilisé partout
```bash
grep -r "from.*users\|import.*users" src/ --include="*.ts" --include="*.tsx" | grep -v "crmUsers\|comment\|CRM"
# Devrait retourner 0 résultats
```

## 📚 Utilisation

### Importer et utiliser crmUsers
```typescript
import { getDb, crmUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';

// Exemple: Récupérer tous les utilisateurs CRM
const db = await getDb();
const allCrmUsers = await db.select().from(crmUsers);

// Exemple: Trouver un utilisateur par email
const user = await db.select()
  .from(crmUsers)
  .where(eq(crmUsers.email, 'user@example.com'))
  .limit(1);
```

## ⚠️ Notes Importantes

1. **Ne plus utiliser `users`** - Utilisez toujours `crmUsers` pour éviter les conflits
2. **Supabase auth.users** - Reste disponible via l'API Supabase pour l'authentification
3. **Migration idempotente** - La migration `0001_rename_users_to_crm_users.sql` peut être exécutée plusieurs fois sans problème
4. **RSC Boundaries** - Les composants serveur (`layout.tsx`) n'importent plus de hooks React directement

## 🐛 Si des erreurs persistent

1. **Vider complètement le cache:**
   ```bash
   rm -rf .next node_modules/.cache
   npm run dev
   ```

2. **Vérifier les imports circulaires:**
   ```bash
   grep -r "export.*from.*schema\|export.*from.*db" src/lib/db/
   ```

3. **Vérifier TypeScript:**
   ```bash
   npm run typecheck
   ```
