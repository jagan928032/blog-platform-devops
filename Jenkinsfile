pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    stages {
        stage('Checkout Info') {
            steps {
                sh 'pwd'
                sh 'ls -la'
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Backend Install') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Check') {
            steps {
                withEnv(["PATH=/opt/homebrew/bin:/usr/local/bin:${env.PATH}"]) {
                    sh 'which docker'
                    sh 'which docker-credential-desktop'
                    sh 'docker version'
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                withEnv(["PATH=/opt/homebrew/bin:/usr/local/bin:${env.PATH}"]) {
                    sh 'docker build -t blog-platform-backend:latest ./backend'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                withEnv(["PATH=/opt/homebrew/bin:/usr/local/bin:${env.PATH}"]) {
                    sh 'docker build --build-arg VITE_API_URL=http://localhost:5001/api -t blog-platform-frontend:latest ./frontend'
                }
            }
        }
    }
}
