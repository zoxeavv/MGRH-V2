# Stratégie de Debug Globale

Ce document décrit une stratégie globale pour prévenir et résoudre les erreurs courantes dans cette application Next.js.

## 🔍 Problèmes Courants et Solutions

### 1. Erreur: `Cannot read properties of undefined (reading 'select')`

**Cause**: La fonction `getDb()` retourne `undefined` ou `null` mais le code essaie d'utiliser `.select()` dessus.

**Solution**:
- ✅ Toujours vérifier que `db` n'est pas `null` avant de l'utiliser
- ✅ Utiliser des try-catch avec gestion gracieuse des erreurs
- ✅ Retourner `null` au lieu de `undefined` pour une meilleure détection

**Exemple de code sécurisé**:
```typescript
const db = await getDb();
if (!db) {
  console.warn('Database not available');
  return null; // ou une valeur par défaut
}

const result = await db.select()...
```

### 2. Erreur: `useState only works in Client Components`

**Cause**: Utilisation de hooks React (`useState`, `useEffect`, etc.) dans un Server Component.

**Solution**:
- ✅ Ajouter `"use client"` en haut de tous les fichiers qui utilisent des hooks React
- ✅ Séparer les Server Components des Client Components
- ✅ Utiliser `ClientProviders` pour centraliser les providers client-side

**Checklist**:
- [ ] Tous les hooks (`use-toast.ts`, `useState`, etc.) ont `"use client"`
- [ ] Tous les composants utilisant des hooks ont `"use client"`
- [ ] Les Server Components n'importent pas directement des Client Components avec hooks

### 3. Erreur: `relation "users" does not exist`

**Cause**: Le code utilise encore l'ancienne table `users` au lieu de `crm_users`.

**Solution**:
- ✅ Toujours utiliser `crmUsers` depuis `@/lib/db/schema`
- ✅ Ne jamais référencer directement `users` dans le code
- ✅ Utiliser `eq(crmUsers.id, ...)` au lieu de `eq(users.id, ...)`

**Migration**:
```typescript
// ❌ Ancien code
import { users } from '@/lib/db/schema';
await db.select().from(users)...

// ✅ Nouveau code
import { crmUsers } from '@/lib/db/schema';
await db.select().from(crmUsers)...
```

### 4. Erreur: `Module not found: Can't resolve '@mui/material'`

**Cause**: MUI n'est pas installé dans `node_modules`.

**Solution**:
```bash
npm install @mui/material@^7.3.5 @emotion/react@^11.14.0 @emotion/styled@^11.14.1 --legacy-peer-deps
```

### 5. Erreur: Database connection errors

**Cause**: Variables d'environnement manquantes ou connexion DB échouée.

**Solution**:
- ✅ Vérifier que `SUPABASE_DB_URL` est défini dans `.env.local`
- ✅ Utiliser `checkDatabaseConnection()` avant les opérations critiques
- ✅ Gérer gracieusement les erreurs de connexion

## 🛡️ Règles de Développement

### Règle 1: Toujours vérifier les valeurs null/undefined

```typescript
// ❌ Mauvais
const db = await getDb();
const users = await db.select()...

// ✅ Bon
const db = await getDb();
if (!db) {
  return null; // ou gérer l'erreur
}
const users = await db.select()...
```

### Règle 2: Séparer Server et Client Components

```typescript
// Server Component (pas de "use client")
export default async function ServerPage() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}

// Client Component (avec "use client")
"use client";
export function ClientComponent({ data }) {
  const [state, setState] = useState();
  return <div>...</div>;
}
```

### Règle 3: Utiliser les bons imports de schéma

```typescript
// ✅ Toujours utiliser crmUsers
import { crmUsers } from '@/lib/db/schema';

// ❌ Ne jamais utiliser users directement
// import { users } from '@/lib/db/schema';
```

### Règle 4: Gestion d'erreur gracieuse

```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  return null; // ou valeur par défaut
}
```

## 🔧 Scripts de Vérification

### Vérifier les imports de schéma
```bash
grep -r "from.*users" src/ --exclude-dir=node_modules
# Ne doit retourner que des commentaires ou crmUsers
```

### Vérifier les "use client" manquants
```bash
grep -r "useState\|useEffect" src/ --exclude-dir=node_modules | grep -v "use client"
# Ne doit rien retourner
```

### Vérifier les appels à getDb() non sécurisés
```bash
grep -A 5 "getDb()" src/ | grep -v "if.*db"
# Vérifier manuellement que chaque appel est vérifié
```

## 📋 Checklist Avant Commit

- [ ] Tous les fichiers avec hooks ont `"use client"`
- [ ] Tous les appels à `getDb()` sont vérifiés pour null
- [ ] Tous les imports utilisent `crmUsers` et non `users`
- [ ] Les erreurs sont gérées gracieusement (try-catch)
- [ ] Le build passe sans erreur (`npm run build`)
- [ ] Le typecheck passe (`npm run typecheck`)

## 🚨 En Cas d'Erreur

1. **Vérifier les logs**: Regarder la console pour les erreurs détaillées
2. **Vérifier les variables d'environnement**: `.env.local` existe et contient `SUPABASE_DB_URL`
3. **Nettoyer les caches**: `rm -rf .next node_modules/.cache`
4. **Réinstaller les dépendances**: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps`
5. **Vérifier le schéma DB**: `npm run db:push` pour synchroniser le schéma

## 📚 Ressources

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Material-UI Documentation](https://mui.com/)
