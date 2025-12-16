#!/bin/bash

# Script d'initialisation Git pour le projet sample
# Utilisation: ./init-git.sh

echo "🚀 Initialisation du repository Git..." | tee /dev/stderr

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé" | tee /dev/stderr
    exit 1
fi

# Vérifier si c'est déjà un repo Git
if [ -d ".git" ]; then
    echo "ℹ️ Repository Git déjà initialisé" | tee /dev/stderr
    echo "📊 Statut actuel:" | tee /dev/stderr
    git status --short
    exit 0
fi

# Initialiser le repository
echo "📝 Initialisation du repository..." | tee /dev/stderr
git init

# Configurer Git (optionnel)
echo "⚙️ Configuration Git de base..." | tee /dev/stderr
git config user.name "Sample Project" 2>/dev/null || true
git config user.email "sample@example.com" 2>/dev/null || true

# Ajouter les fichiers
echo "📦 Ajout des fichiers..." | tee /dev/stderr
git add .

# Premier commit
echo "💾 Premier commit..." | tee /dev/stderr
git commit -m "feat: initial commit - Sample Node.js React + Express project

- Backend Express.js avec API REST
- Frontend React avec interface moderne
- Tests unitaires Jest
- Pipeline Jenkins CI/CD complet
- Docker support
- Documentation complète

Projet de démonstration pour tests Jenkins"

echo "✅ Repository Git initialisé !" | tee /dev/stderr
echo "" | tee /dev/stderr
echo "📋 Prochaines étapes:" | tee /dev/stderr
echo "1. Créer un repository sur GitHub/GitLab" | tee /dev/stderr
echo "2. Ajouter le remote: git remote add origin <url>" | tee /dev/stderr
echo "3. Pousser: git push -u origin main" | tee /dev/stderr
echo "" | tee /dev/stderr
echo "🔗 URL du repository à créer:" | tee /dev/stderr
echo "   https://github.com/VOTRE-USERNAME/sample-nodejs-project" | tee /dev/stderr
echo "" | tee /dev/stderr
echo "📊 Statut du repository:" | tee /dev/stderr
git status