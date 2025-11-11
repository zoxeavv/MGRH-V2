#!/bin/bash
# Script pour résoudre le problème MUI non trouvé

set -e

echo "🔧 Nettoyage des caches..."
cd "$(dirname "$0")"
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

echo "📦 Vérification de l'installation de MUI..."
if [ ! -d "node_modules/@mui/material" ]; then
    echo "❌ MUI n'est pas installé. Installation..."
    npm install @mui/material @emotion/react @emotion/styled --legacy-peer-deps
else
    echo "✅ MUI est installé"
fi

echo "🔍 Vérification de la structure..."
ls -la node_modules/@mui/material/package.json 2>/dev/null && echo "✅ package.json trouvé" || echo "❌ package.json manquant"

echo "🧪 Test d'import..."
node -e "try { require('@mui/material'); console.log('✅ MUI peut être importé'); } catch(e) { console.log('❌ Erreur:', e.message); process.exit(1); }"

echo "🏗️  Build..."
npm run build

echo "✅ Terminé!"
