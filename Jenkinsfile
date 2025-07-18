def ENV_NAME = getEnvName(env.BRANCH_NAME)
def CONTAINER_NAME = "angular-app-" + ENV_NAME
def CONTAINER_TAG = getTag(env.BUILD_NUMBER, env.BRANCH_NAME)
def HTTP_PORT = getHTTPPort(env.BRANCH_NAME)
def EMAIL_RECIPIENTS = "votre-email@example.com"

node {
    try {
        stage('Initialize') {
            def dockerHome = tool 'dockerlatest'
            def nodeHome = tool 'nodelatest'
            env.PATH = "${dockerHome}/bin:${nodeHome}/bin:${env.PATH}"
        }

        stage('Checkout') {
            checkout scm
        }

        // ÉTAPE 1: BUILD ANGULAR
        stage('Angular Build') {
            sh 'npm ci'  // Installation des dépendances (plus rapide que npm install)
            
            // Build selon l'environnement
            if (ENV_NAME == 'prod') {
                sh 'npm run build:prod'
            } else if (ENV_NAME == 'uat') {
                sh 'npm run build:uat'
            } else {
                sh 'npm run build:dev'
            }
            
            // Vérifier que le build a créé les fichiers
            sh 'ls -la dist/'
            
            // Optionnel: Tests unitaires
            // sh 'npm run test:ci'
        }

        // ÉTAPE 2: CONTAINERISATION
        stage('Docker Build & Push') {
            // Build de l'image Docker
            sh "docker build -t $CONTAINER_NAME:$CONTAINER_TAG -t $CONTAINER_NAME --pull --no-cache ."
            echo "Docker image built: $CONTAINER_NAME:$CONTAINER_TAG"
            
            // Push vers Docker Registry
            withCredentials([usernamePassword(credentialsId: 'dockerhubcredential', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                sh "docker login -u $USERNAME -p $PASSWORD"
                sh "docker tag $CONTAINER_NAME:$CONTAINER_TAG $USERNAME/$CONTAINER_NAME:$CONTAINER_TAG"
                sh "docker push $USERNAME/$CONTAINER_NAME:$CONTAINER_TAG"
                echo "Image pushed to registry"
            }
        }

        // ÉTAPE 3: DÉPLOIEMENT
        stage('Deploy Application') {
            withCredentials([usernamePassword(credentialsId: 'dockerhubcredential', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                // Arrêter le conteneur existant s'il existe
                sh "docker stop $CONTAINER_NAME || true"
                sh "docker rm $CONTAINER_NAME || true"
                
                // Déployer la nouvelle version
                sh "docker pull $USERNAME/$CONTAINER_NAME:$CONTAINER_TAG"
                sh "docker run -d -p $HTTP_PORT:80 --name $CONTAINER_NAME $USERNAME/$CONTAINER_NAME:$CONTAINER_TAG"
                
                echo "Application deployed successfully on port: $HTTP_PORT"
                echo "Access URL: http://localhost:$HTTP_PORT"
            }
        }

    } catch (Exception e) {
        currentBuild.result = 'FAILURE'
        throw e
    } finally {
        deleteDir()
        sendEmail(EMAIL_RECIPIENTS)
    }
}

// FONCTIONS UTILITAIRES (identiques à l'original)
def sendEmail(recipients) {
    mail(
        to: recipients,
        subject: "Angular Build ${env.BUILD_NUMBER} - ${currentBuild.currentResult} - (${currentBuild.fullDisplayName})",
        body: "Check console output at: ${env.BUILD_URL}/console\n" +
              "Environment: ${ENV_NAME}\n" +
              "Port: ${HTTP_PORT}\n"
    )
}

String getEnvName(String branchName) {
    if (branchName == 'main') {
        return 'prod'
    }
    return (branchName == 'develop') ? 'uat' : 'dev'
}

String getHTTPPort(String branchName) {
    if (branchName == 'main') {
        return '8083'  // Port pour prod
    }
    return (branchName == 'develop') ? '8082' : '8081'  // UAT et DEV
}

String getTag(String buildNumber, String branchName) {
    if (branchName == 'main') {
        return buildNumber + '-prod'
    }
    return (branchName == 'develop') ? buildNumber + '-uat' : buildNumber + '-dev'
}