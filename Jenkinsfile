pipeline {
     agent any
     
     tools {nodejs "node"}
     
     stages {
        stage("Build") {
            steps {
                sh "npm install"
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
