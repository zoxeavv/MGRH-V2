#!/bin/bash
# Script de correction complète - Exécutez: bash apply-fixes.sh

cd /Users/thier/Ehnsm/Modernize-Nextjs-Free/package

echo "🔧 Application des corrections..."

# 1. Corriger DashboardShell.tsx - Imports par défaut
echo "1. Correction de DashboardShell.tsx..."
cat > src/components/DashboardShell.tsx << 'DASHEOF'
"use client";

import { useState } from "react";
import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar
        isSidebarOpen={true}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col lg:pl-64">
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
DASHEOF

# 2. Vérifier schema.ts (devrait déjà être correct)
echo "2. Vérification de schema.ts..."
SCHEMA_EXPORTS=$(grep -c 'export const' src/lib/db/schema.ts 2>/dev/null || echo "0")
if [ "$SCHEMA_EXPORTS" -gt 2 ]; then
  echo "   ⚠️  Schema.ts a plus de 2 exports, correction nécessaire..."
  # Supprimer le doublon users (lignes 26-33)
  sed -i '' '26,33d' src/lib/db/schema.ts 2>/dev/null
  sed -i '' 's/export const users = pgTable/export const crmUsers = pgTable/g' src/lib/db/schema.ts 2>/dev/null
  sed -i '' "s/'users'/'crm_users'/g" src/lib/db/schema.ts 2>/dev/null
  sed -i '' 's/users_email_unique/crm_users_email_unique/g' src/lib/db/schema.ts 2>/dev/null
  echo "   ✅ Schema.ts corrigé"
else
  echo "   ✅ Schema.ts correct ($SCHEMA_EXPORTS exports)"
fi

# 3. Vérifier Header.tsx
echo "3. Vérification de Header.tsx..."
if grep -q '@mui/material' src/app/\(DashboardLayout\)/layout/header/Header.tsx 2>/dev/null; then
  echo "   ✅ Header.tsx utilise Material-UI"
else
  echo "   ⚠️  Header.tsx doit être corrigé manuellement"
fi

# 4. Corriger postcss.config.js
echo "4. Correction de postcss.config.js..."
echo 'module.exports = {
  plugins: {
    autoprefixer: {},
  },
};' > postcss.config.js
echo "   ✅ PostCSS configuré sans Tailwind"

# 5. Vérifier les dépendances
echo "5. Vérification des dépendances..."
if [ ! -d "node_modules/@mui" ]; then
  echo "   ⚠️  @mui/material n'est pas installé"
  echo "   📦 Exécution de npm install..."
  npm install
else
  echo "   ✅ @mui/material est installé"
fi

echo ""
echo "✅ Toutes les corrections appliquées !"
echo ""
echo "📋 Résumé:"
echo "   Schema.ts: $(grep -c 'export const' src/lib/db/schema.ts 2>/dev/null || echo '0') exports"
echo "   Header.tsx: $(grep -q '@mui/material' src/app/\(DashboardLayout\)/layout/header/Header.tsx 2>/dev/null && echo 'MUI ✅' || echo 'À corriger ❌')"
echo "   DashboardShell.tsx: $(grep -q 'import Header from' src/components/DashboardShell.tsx 2>/dev/null && echo 'Imports corrects ✅' || echo 'À corriger ❌')"
echo "   PostCSS: $(grep -q 'tailwindcss' postcss.config.js 2>/dev/null && echo 'A Tailwind ❌' || echo 'OK ✅')"
echo ""
echo "🚀 Prochaines étapes:"
echo "   rm -rf .next"
echo "   npm run dev"
