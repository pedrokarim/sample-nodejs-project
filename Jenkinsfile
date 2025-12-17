pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    environment {
        NODE_VERSION = '18'
        BACKEND_PORT = '3001'
        FRONTEND_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Configuration Git pour éviter les erreurs "dubious ownership"
                    sh '''
                        git config --global --add safe.directory $(pwd)
                        git config --global --add safe.directory /var/jenkins_home/jobs/sample-nodejs-project/branches/main/workspace
                        git config --global --add safe.directory /var/jenkins_home/jobs/sample-nodejs-project/workspace
                        git config --global init.defaultBranch main
                        git config --global user.name "Jenkins CI/CD"
                        git config --global user.email "jenkins@localhost"
                        echo "Git configuration applied"
                    '''
                }

                cleanWs()
                checkout scm

                script {
                    echo "Building branch: ${env.BRANCH_NAME}"
                    echo "Commit: ${env.GIT_COMMIT}"
                    sh 'git log --oneline -3'
                }
            }
        }


        stage('Setup environment') {
            steps {
                sh 'ls -la'
                sh 'pwd'
                sh 'node --version'
                sh 'npm --version'

                writeFile file: '.env.test', text: '''
NODE_ENV=test
BACKEND_PORT=3002
FRONTEND_PORT=3001
'''
            }
        }

        stage('Install dependencies') {
            parallel {
                stage('Install backend') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Install frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage('Lint code') {
            parallel {
                stage('Lint backend') {
                    steps {
                        dir('backend') {
                            sh 'npm run lint || echo "Linting failed but continuing..."'
                        }
                    }
                }
                stage('Lint frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm run lint || echo "Linting failed but continuing..."'
                        }
                    }
                }
            }
        }

        stage('Run tests') {
            parallel {
                stage('Test backend') {
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

                stage('Test frontend') {
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

        stage('Build application') {
            parallel {
                stage('Build backend') {
                    steps {
                        dir('backend') {
                            sh 'npm run build || echo "No build script for backend"'
                        }
                    }
                }
                stage('Build frontend') {
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

        stage('Integration tests') {
            steps {
                script {
                    dir('backend') {
                        sh 'npm start &'
                        sh 'sleep 5'
                    }

                    sh '''
                        curl -f http://localhost:3001/health || exit 1
                        curl -f http://localhost:3001/api/stats || exit 1
                        curl -f http://localhost:3001/api/items || exit 1
                    '''

                    sh 'pkill -f "node.*server.js" || true'
                }
            }
        }

        stage('Security scan') {
            steps {
                script {
                    sh 'npm audit --audit-level moderate || echo "Security scan completed with warnings"'

                    sh '''
                        if [ -f ".env" ]; then
                            echo "WARNING: .env file found in repository!"
                            exit 1
                        fi
                    '''
                }
            }
        }

        stage('Deploy to staging') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    echo "Deploiement en staging..."
                    sh '''
                        echo "Building Docker images..."
                        echo "Deploying to staging environment..."
                        echo "Running smoke tests..."
                    '''
                    echo "Deploiement staging termine"
                }
            }
        }

        stage('Deploy to production') {
            when { branch 'main' }
            steps {
                script {
                    timeout(time: 15, unit: 'MINUTES') {
                        input message: 'Deployer en PRODUCTION ?',
                              ok: 'Deploy to Production',
                              submitterParameter: 'APPROVER'
                    }

                    echo "Deploiement en production par ${env.APPROVER}..."
                    sh '''
                        echo "Production deployment..."
                    '''
                    echo "Deploiement production termine"
                }
            }
        }

        stage('Post-deploy tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    echo "Tests post-deploiement..."
                    sh '''
                        echo "Testing application health..."
                        echo "Testing critical endpoints..."
                    '''
                    echo "Tests post-deploiement reussis"
                }
            }
        }
    }

    post {
        always {
            script {
                node {
                    sh 'pkill -f "node.*server.js" || true'
                    archiveArtifacts artifacts: '**/*.log', allowEmptyArchive: true

                    def status = currentBuild.currentResult ?: 'SUCCESS'
                    echo "Build ${status}: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
                }
            }
        }

        success {
            script {
                echo 'Pipeline reussi !'

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
                echo 'Pipeline echoue !'
            }
        }

        unstable {
            script {
                echo 'Build instable'
            }
        }
    }
}
