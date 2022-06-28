pipeline {
     agent any
     
     tools {nodejs "node"}
     
     stages {
         stage("Dependency Install") {
            steps {
                sh "npm install"
            }
        }
        stage('SonarQube analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh "./gradlew sonarqube"
                }
            }
        }
        stage("Quality gate") {
            steps {
                waitForQualityGate abortPipeline: true
            }
        }
        stage("Test") {
            steps {
                sh "npm run test -- --coverage --watchAll=false"
            }
        }
        stage("Build") {
            steps {
                sh "npm run build"
            }
        }
        stage("Deploy") {
            steps {
                sh "rm -rf /var/www/scowin-react-app"
                sh "cp -r ${WORKSPACE}/build/ /var/www/scowin-react-app/"
            }
        }
    }
}
