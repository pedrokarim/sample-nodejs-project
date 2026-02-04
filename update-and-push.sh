#!/bin/bash

# Script pour mettre à jour et pousser les modifications
# Utilisation: ./update-and-push.sh

echo "🔄 Mise à jour des URLs et push vers GitHub..."

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Vous devez exécuter ce script depuis le répertoire sample-nodejs-project"
    exit 1
fi

# Ajouter les modifications
echo "📦 Ajout des modifications..."
git add .

# Commit des modifications
echo "💾 Commit des mises à jour..."
git commit -m "fix: update repository URLs to match GitHub repo

- Update Jenkinsfile repository URL
- Update package.json repository URL
- Update README with correct GitHub URL
- Update scripts with proper URLs"

# Push vers GitHub
echo "🚀 Push vers GitHub..."
if git push origin main; then
    echo "✅ Modifications poussées avec succès !"
    echo ""
    echo "🌐 Repository GitHub: https://github.com/pedrokarim/sample-nodejs-project"
    echo "📊 Actions GitHub: https://github.com/pedrokarim/sample-nodejs-project/actions"
else
    echo "❌ Erreur lors du push. Vérifiez vos credentials Git."
    exit 1
fi