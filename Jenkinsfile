pipeline {
    agent any

    environment {
        SERVER_USER = "root"                // User SSH trên Server B
        SERVER_HOST = "103.170.123.199"         // IP Server B
        PROJECT_DIR = "/intest"      // Thư mục deploy trên Server B
        REPO_URL = "git@github.com:david-cung/BE-coaching-project.git"
        PATH = "/Users/dc/.nvm/versions/node/v20.16.0/bin:$PATH"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials', url: "${REPO_URL}"
            }
        }

        stage('Install Dependencies & Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Deploy to Server') {
            steps {
                sh """
                ssh ${SERVER_USER}@${SERVER_HOST} 'mkdir -p ${PROJECT_DIR}'
                scp -r dist package.json ${SERVER_USER}@${SERVER_HOST}:${PROJECT_DIR}/
                ssh ${SERVER_USER}@${SERVER_HOST} 'cd ${PROJECT_DIR} && npm install --only=prod'
                """
            }
        }

        stage('Restart App with PM2') {
            steps {
                sh """
                ssh ${SERVER_USER}@${SERVER_HOST} '
                pm2 delete coaching-app || true
                pm2 start ${PROJECT_DIR}/dist/main.js --name coaching-app
                pm2 save
                pm2 restart coaching-app
                '
                """
            }
        }
    }
}
