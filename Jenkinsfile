pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        DOCKERHUB_REPO_BACKEND = 'jpv928032/blog-platform-backend'
        DOCKERHUB_REPO_FRONTEND = 'jpv928032/blog-platform-frontend'
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
                    sh 'docker build -t $DOCKERHUB_REPO_BACKEND:latest ./backend'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                withEnv(["PATH=/opt/homebrew/bin:/usr/local/bin:${env.PATH}"]) {
                    sh 'docker build --build-arg VITE_API_URL=http://localhost:5001/api -t $DOCKERHUB_REPO_FRONTEND:latest ./frontend'
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    withEnv(["PATH=/opt/homebrew/bin:/usr/local/bin:${env.PATH}"]) {
                        sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    }
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                withEnv(["PATH=/opt/homebrew/bin:/usr/local/bin:${env.PATH}"]) {
                    sh 'docker push $DOCKERHUB_REPO_BACKEND:latest'
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                withEnv(["PATH=/opt/homebrew/bin:/usr/local/bin:${env.PATH}"]) {
                    sh 'docker push $DOCKERHUB_REPO_FRONTEND:latest'
                }
            }
        }
    }
}
