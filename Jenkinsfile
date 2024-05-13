pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh "cd TestBackend"
                checkout scm
                sh "docker compose build"
            }
        }

        stage('Run') {
            steps {
                checkout scm
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
