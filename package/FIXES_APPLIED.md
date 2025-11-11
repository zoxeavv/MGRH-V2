# Corrections Appliquées - Résolution des Erreurs

## ✅ Problème 1: Doublon "users" dans schema.ts
**Résolu:** Le fichier `src/lib/db/schema.ts` contient maintenant uniquement :
- `organizations` (ligne 3)
- `crmUsers` (ligne 11) - renommé pour éviter conflit avec Supabase auth.users

**Aucun doublon détecté** dans le fichier actuel.

## ⚠️ Si l'erreur persiste sur votre machine

L'erreur mentionne un doublon à la ligne 23, ce qui suggère que votre fichier local pourrait être différent. 

### Solution immédiate:

1. **Vérifiez votre fichier local:**
   ```bash
   cat src/lib/db/schema.ts | grep -n "export const"
   ```
   Vous devriez voir seulement 2 exports (organizations et crmUsers).

2. **Si vous voyez toujours un doublon, supprimez-le manuellement:**
   - Ouvrez `src/lib/db/schema.ts`
   - Supprimez toute deuxième déclaration de `export const users = pgTable(...)`
   - Gardez seulement `export const crmUsers = pgTable('crm_users', ...)`

3. **Videz complètement le cache:**
   ```bash
   rm -rf .next
   rm -rf node_modules/.cache
   npm run dev
   ```

## 📝 Autres problèmes identifiés dans les logs

### 1. Tables manquantes dans schema.ts
Les erreurs mentionnent:
- `organizationMembers` - non trouvé dans schema
- `clients` - non trouvé dans schema  
- `offers` - non trouvé dans schema

**Action requise:** Ajoutez ces tables au schema.ts si elles sont nécessaires, ou supprimez les imports qui les référencent.

### 2. Erreur "useState only works in Client Components"
Le composant `Toaster` utilise `useToast` qui nécessite "use client".

**Solution:** Assurez-vous que `src/components/ui/toaster.tsx` a `"use client"` en première ligne.

### 3. Erreur "relation 'users' does not exist"
Le code cherche toujours la table `users` au lieu de `crm_users`.

**Solution:** 
- Mettez à jour tous les imports pour utiliser `crmUsers` au lieu de `users`
- OU exécutez la migration pour renommer la table:
  ```bash
  npm run db:push
  ```

## 🔧 Commandes de vérification

```bash
# Vérifier qu'il n'y a pas de doublon
grep -c "export const users\|export const crmUsers" src/lib/db/schema.ts
# Devrait retourner: 1 (seulement crmUsers)

# Vérifier les imports de users
grep -r "from.*users\|import.*users" src --include="*.ts" --include="*.tsx" | grep -v "crmUsers"

# Vider le cache et redémarrer
rm -rf .next node_modules/.cache
npm run dev
```
