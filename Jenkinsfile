pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                checkout scm
                sh '''
                docker-compose build
                docker-compose up -d
                '''
            }
        }
        stage('Test') {
            steps {
                echo "Test"
                sh '''
                    pip install requests
                    python3 test/pytest.py
                    '''
            }
            post { 
                always { 
                   sh "docker-compose stop"
                }
            }
        }
    
        stage("Deploy"){
            steps{
                echo "Deploy"
                sh """cd /var/backend-serv
                    docker-compose stop
                    cp -r /var/jenkins/workspace/back/* /var/backend-serv
                    docker-compose build
                    docker-compose up -d
                """
            }    
        }
    }
}
