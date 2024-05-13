pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh "cd /srv/TicTacToe/TestBackend"
                checkout scm
                sh "docker compose build"
            }
        }

        stage('Run') {
            steps {
                sh """
                    docker compose up -d
                    docker compose stop
                """
            }
        }
    
        stage("Deploy"){
            steps{
                echo "Deploy"
                sh """
                    cd ../Backend
                    cp -r ../TestBackend/* .
                    docker-compose build
                    docker-compose up -d
                """
            }    
        }
    }
}
