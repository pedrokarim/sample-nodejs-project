# Dockerfile pour le frontend React
FROM node:18-alpine

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci && npm cache clean --force

# Copier le code source
COPY . .

# Build l'application
RUN npm run build

# Installer serve pour servir les fichiers statiques
RUN npm install -g serve

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Changer les permissions
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exposer le port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Démarrer l'application
CMD ["serve", "-s", "build", "-l", "3000"]