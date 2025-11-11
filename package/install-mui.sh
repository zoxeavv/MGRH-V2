#!/bin/bash
# Script pour installer MUI et corriger le problème

set -e

echo "🔧 Installation de MUI et dépendances..."

cd "$(dirname "$0")"

# Installer MUI et ses dépendances requises
echo "📦 Installation de @mui/material..."
npm install @mui/material@^7.3.5 --legacy-peer-deps

echo "📦 Installation de @emotion/react..."
npm install @emotion/react@^11.14.0 --legacy-peer-deps

echo "📦 Installation de @emotion/styled..."
npm install @emotion/styled@^11.14.1 --legacy-peer-deps

echo "📦 Installation de @mui/icons-material..."
npm install @mui/icons-material@^7.0.1 --legacy-peer-deps

echo "📦 Installation de @mui/lab..."
npm install @mui/lab@^7.0.0-beta.10 --legacy-peer-deps

echo "✅ Vérification de l'installation..."
npm list @mui/material

echo "🧹 Nettoyage du cache Next.js..."
rm -rf .next

echo "✅ Terminé! Vous pouvez maintenant lancer: npm run dev"
