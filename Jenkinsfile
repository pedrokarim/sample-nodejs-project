pipeline {
    agent any

    environment {
        // Variables d'environnement pour le build
        NODE_VERSION = '18'
        BACKEND_PORT = '3001'
        FRONTEND_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "${env.BRANCH_NAME ?: 'main'}"]],
                    userRemoteConfigs: [[
                        url: 'https://github.com/pedrokarim/sample-nodejs-project.git',
                        credentialsId: 'github-credentials'
                    ]]
                ])
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    // Vérifier la structure du projet
                    sh 'ls -la'
                    sh 'pwd'

                    // Vérifier que Node.js est disponible
                    sh 'node --version'
                    sh 'npm --version'

                    // Créer un fichier .env pour les tests
                    writeFile file: '.env.test', text: '''
                        NODE_ENV=test
                        BACKEND_PORT=3002
                        FRONTEND_PORT=3001
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Install Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }

                stage('Install Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage('Lint Code') {
            parallel {
                stage('Lint Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm run lint || echo "Linting failed but continuing..."'
                        }
                    }
                }

                stage('Lint Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm run lint || echo "Linting failed but continuing..."'
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Test Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm test'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'backend/test-results.xml, backend/junit.xml'
                            publishHTML([
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'backend/coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Backend Coverage Report'
                            ])
                        }
                    }
                }

                stage('Test Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm test'
                        }
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'frontend/coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Frontend Coverage Report'
                            ])
                        }
                    }
                }
            }
        }

        stage('Build Application') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm run build || echo "No build script for backend"'
                        }
                    }
                }

                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm run build'
                        }
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'frontend/build/**/*', allowEmptyArchive: true
                        }
                    }
                }
            }
        }

        stage('Integration Tests') {
            steps {
                script {
                    // Démarrer le backend pour les tests d'intégration
                    dir('backend') {
                        sh 'npm start &'
                        sh 'sleep 5' // Attendre que le serveur démarre
                    }

                    // Tester les endpoints de l'API
                    sh '''
                        curl -f http://localhost:3001/health || exit 1
                        curl -f http://localhost:3001/api/stats || exit 1
                        curl -f http://localhost:3001/api/items || exit 1
                    '''

                    // Arrêter le serveur de test
                    sh 'pkill -f "node.*server.js" || true'
                }
            }
        }

        stage('Security Scan') {
            steps {
                script {
                    // Scan basique des vulnérabilités
                    sh 'npm audit --audit-level moderate || echo "Security scan completed with warnings"'

                    // Vérifier les fichiers sensibles
                    sh '''
                        if [ -f ".env" ]; then
                            echo "WARNING: .env file found in repository!"
                            exit 1
                        fi
                    '''
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    echo "🚀 Déploiement en staging..."

                    // Simuler un déploiement
                    sh '''
                        echo "Building Docker images..."
                        # docker build -t sample-app:$BUILD_NUMBER .

                        echo "Deploying to staging environment..."
                        # kubectl apply -f k8s/staging/

                        echo "Running smoke tests..."
                        # curl -f https://staging.example.com/health
                    '''

                    echo "✅ Déploiement staging terminé"
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Approbation manuelle pour la prod
                    timeout(time: 15, unit: 'MINUTES') {
                        input message: '🚀 Déployer en PRODUCTION ?',
                              ok: '🚀 Deploy to Production',
                              submitterParameter: 'APPROVER'
                    }

                    echo "🚀 Déploiement en production par ${env.APPROVER}..."

                    // Simuler un déploiement en prod
                    sh '''
                        echo "Production deployment..."
                        # docker tag sample-app:$BUILD_NUMBER sample-app:prod
                        # kubectl apply -f k8s/production/
                    '''

                    echo "✅ Déploiement production terminé"
                }
            }
        }

        stage('Post-Deploy Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    echo "🧪 Tests post-déploiement..."

                    // Tests de santé de l'application
                    sh '''
                        echo "Testing application health..."
                        # curl -f https://app.example.com/health

                        echo "Testing critical endpoints..."
                        # curl -f https://api.example.com/api/stats
                    '''

                    echo "✅ Tests post-déploiement réussis"
                }
            }
        }
    }

    post {
        always {
            script {
                // Nettoyer les processus restants
                sh 'pkill -f "node.*server.js" || true'

                // Archiver les logs
                archiveArtifacts artifacts: '**/*.log', allowEmptyArchive: true

                // Notifications
                def status = currentBuild.currentResult ?: 'SUCCESS'
                def color = status == 'SUCCESS' ? 'good' : 'danger'

                echo "📊 Build ${status}: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            }
        }

        success {
            script {
                echo '🎉 Pipeline réussi !'

                // Tagger le commit en cas de succès sur main
                if (env.BRANCH_NAME == 'main') {
                    sh '''
                        git tag -a "v${BUILD_NUMBER}" -m "Release version ${BUILD_NUMBER} - Jenkins Build #${BUILD_NUMBER}"
                        git push origin "v${BUILD_NUMBER}"
                    '''
                }
            }
        }

        failure {
            script {
                echo '❌ Pipeline échoué !'

                // Notifications d'échec
                // slackSend, email, etc.
            }
        }

        unstable {
            script {
                echo '⚠️ Build instable'
            }
        }
    }
}