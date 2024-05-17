pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
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
                    cp -r ./* /srv/TicTacToe/Backend
                    cd /srv/TicTacToe/Backend
                    docker compose build
                    docker compose up -d
                """
            }    
        }
    }
}
