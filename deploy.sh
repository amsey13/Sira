#!/bin/bash
# Script de déploiement automatique pour GitHub Pages

echo "🚀 Déploiement Frise Mecquoise sur GitHub Pages..."

# Build le projet
echo "📦 Build en cours..."
npm run build

# Configure le déploiement
echo "🔧 Configuration du déploiement..."
npx gh-pages -d dist -b gh-pages

echo "✅ Déploiement réussi !"
echo "🌐 Ton site est accessible à:"
echo "   https://TON_USERNAME.github.io/frise-mecquoise"
echo ""
echo "Remplace TON_USERNAME par ton alias GitHub !"

