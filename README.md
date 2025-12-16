# Sample Node.js Project - React + Express

Un projet de démonstration pour tester Jenkins CI/CD avec une stack moderne React + Express.

## 🏗️ Architecture

```
sample-nodejs-project/
├── backend/                 # API Express.js
│   ├── package.json
│   ├── server.js           # Serveur principal
│   ├── routes/
│   │   └── api.js         # Routes API REST
│   └── server.test.js     # Tests unitaires
├── frontend/               # Application React
│   ├── package.json
│   ├── src/
│   │   ├── App.js         # Composant principal
│   │   ├── App.css        # Styles
│   │   └── index.js       # Point d'entrée
│   └── public/
│       └── index.html     # Template HTML
├── Jenkinsfile            # Pipeline CI/CD
└── package.json           # Scripts globaux
```

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Installer toutes les dépendances
npm run install:all

# Ou installer séparément
npm run install:backend
npm run install:frontend
```

### Développement
```bash
# Démarrer backend et frontend en parallèle
npm run dev

# Ou démarrer séparément
npm run start:backend    # http://localhost:3001
npm run start:frontend   # http://localhost:3000
```

### Production
```bash
# Builder le frontend
npm run build:frontend

# Démarrer le backend
npm run start:backend
```

## 🧪 Tests

```bash
# Tests complets
npm test

# Tests backend uniquement
npm run test:backend

# Tests frontend uniquement
npm run test:frontend
```

## 📡 API Endpoints

### Backend (Express.js) - Port 3001

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | État de santé du serveur |
| GET | `/` | Informations API |
| GET | `/api/items` | Liste des éléments |
| POST | `/api/items` | Créer un élément |
| PUT | `/api/items/:id` | Modifier un élément |
| DELETE | `/api/items/:id` | Supprimer un élément |
| GET | `/api/stats` | Statistiques API |

### Exemple d'utilisation API

```bash
# Créer un élément
curl -X POST http://localhost:3001/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"Description"}'

# Lister les éléments
curl http://localhost:3001/api/items

# Vérifier la santé
curl http://localhost:3001/health
```

## 🔧 Scripts disponibles

### Scripts globaux (racine)
```bash
npm run install:all      # Installer toutes les dépendances
npm run dev             # Démarrage développement
npm run build:frontend  # Build production frontend
npm run test            # Tests complets
npm run lint            # Linting complet
```

### Backend
```bash
cd backend
npm start    # Démarrage production
npm run dev  # Démarrage développement
npm test     # Tests
npm run lint # Linting
```

### Frontend
```bash
cd frontend
npm start    # Démarrage développement
npm run build  # Build production
npm test     # Tests avec couverture
npm run lint # Linting
```

## 🐳 Jenkins CI/CD

Le projet inclut un `Jenkinsfile` complet avec :

### Pipeline stages
1. **Checkout** - Récupération du code
2. **Setup** - Configuration environnement
3. **Dependencies** - Installation parallélisée
4. **Lint** - Vérification code
5. **Tests** - Tests unitaires + couverture
6. **Build** - Construction application
7. **Integration** - Tests d'intégration
8. **Security** - Scan sécurité
9. **Deploy** - Déploiement staging/production

### Fonctionnalités Jenkins
- ✅ **Multi-branch** : Support branches main/develop/feature
- ✅ **Tests parallèles** : Backend + Frontend simultanés
- ✅ **Rapports** : Coverage, JUnit, artifacts
- ✅ **Approvals** : Validation manuelle production
- ✅ **Notifications** : Succès/échec
- ✅ **Archivage** : Logs, builds, rapports

### Configuration Jenkins recommandée

1. **Créer un job Multibranch Pipeline**
2. **Repository URL** : `https://github.com/pedrokarim/sample-nodejs-project.git`
3. **Credentials** : `github-credentials`
4. **Script Path** : `Jenkinsfile`

## 🗂️ Structure du projet

### Backend (Express.js)
- **Framework** : Express 4.x
- **Sécurité** : Helmet, CORS
- **Tests** : Jest + Supertest
- **Linting** : ESLint

### Frontend (React)
- **Framework** : React 18
- **Build** : Create React App
- **Tests** : React Testing Library + Jest
- **Styling** : CSS moderne avec variables
- **API** : Axios pour les appels backend

### CI/CD (Jenkins)
- **Pipeline as Code** : Jenkinsfile déclaratif
- **Tests automatisés** : Unitaires + intégration
- **Déploiements** : Staging + Production
- **Rapports** : Couverture + qualité

## 🔒 Sécurité

- ✅ **Backend** : Helmet, CORS, validation input
- ✅ **Frontend** : XSS protection, Content Security Policy
- ✅ **CI/CD** : Scan vulnérabilités npm audit
- ✅ **Credentials** : Gestion sécurisée Jenkins

## 📊 Métriques

### Tests
- **Backend** : 100% couverture visée
- **Frontend** : 70% couverture minimum
- **Integration** : Tests API endpoints

### Performance
- **Build time** : < 5 minutes
- **Test execution** : < 2 minutes
- **Bundle size** : < 500KB (frontend)

## 🤝 Contribution

### Workflow Git
```bash
# Créer une branche feature
git checkout -b feature/nouvelle-fonction

# Commits atomiques
git commit -m "feat: ajouter nouvelle fonctionnalité"

# Push et PR
git push origin feature/nouvelle-fonction
```

### Standards code
- **ESLint** : Respect des règles définies
- **Tests** : Couverture minimum 70%
- **Commits** : Messages conventionnels

## 📝 TODO / Améliorations

- [ ] Ajouter Docker Compose pour développement
- [ ] Implémenter authentification JWT
- [ ] Ajouter monitoring (Prometheus + Grafana)
- [ ] Déploiement Kubernetes
- [ ] Tests E2E avec Cypress
- [ ] CI/CD avancé (blue-green deployment)

## 📄 Licence

MIT - Voir [LICENSE](LICENSE) pour plus de détails.

---

**🎯 Projet de démonstration pour Jenkins CI/CD - Version 1.0.0**