def ENV_NAME = getEnvName(env.BRANCH_NAME)
def CONTAINER_NAME = "angular-app-" + ENV_NAME
def CONTAINER_TAG = getTag(env.BUILD_NUMBER, env.BRANCH_NAME)
def HTTP_PORT = getHTTPPort(env.BRANCH_NAME)
def EMAIL_RECIPIENTS = "votre-email@example.com"

// Configuration GitOps pour ArgoCD
def GITOPS_REPO = "https://github.com/stevymonkam/kubernetes-argocd-angular-javasprintboot.git"
def targetBranch
    switch(ENV_NAME) {
        case 'dev':
            targetBranch = 'feature'
            break
        case 'uat':
            targetBranch = 'develop'
            break
        case 'prod':
            targetBranch = 'main'
            break
        default:
            targetBranch = env.BRANCH_NAME // ou 'main' par défaut
    }
def GITOPS_CREDENTIALS = "gitops-repo-credentials"

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

       // ÉTAPE 2: CONTAINERISATION
        stage('Image Build') {
            imageBuild(CONTAINER_NAME, CONTAINER_TAG)
        }

        stage('Push to Docker Registry') {
            withCredentials([usernamePassword(credentialsId: 'dockerhubcredential', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                pushToImage(CONTAINER_NAME, CONTAINER_TAG, USERNAME, PASSWORD)
            }
        }

        // ÉTAPE 3: MISE À JOUR GITOPS POUR ARGOCD
        stage('Update GitOps Repository') {
            withCredentials([usernamePassword(credentialsId: 'gitops-credentials-argocd', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                updateGitOpsManifests(CONTAINER_NAME, CONTAINER_TAG, ENV_NAME, GIT_USERNAME, GIT_PASSWORD)
            }
        }

        // ÉTAPE 4: SYNCHRONISATION ARGOCD (OPTIONNEL)
        stage('Trigger ArgoCD Sync') {
            // Option 1: Attendre la synchronisation automatique d'ArgoCD
            echo "ArgoCD détectera automatiquement les changements dans le repository GitOps"
            echo "Application sera déployée automatiquement dans l'environnement: ${ENV_NAME}"
            
            // Option 2: Déclencher manuellement la synchronisation (si CLI ArgoCD disponible)
            //triggerArgoCDSync(ENV_NAME)
        }

        // ÉTAPE 5: VÉRIFICATION DU DÉPLOIEMENT
        stage('Verify Deployment') {
            // Attendre quelques secondes pour la synchronisation
            sleep(30)
            
            // Vérifier le statut de l'application ArgoCD
            verifyArgoCDDeployment(ENV_NAME)
        }

    } catch (Exception e) {
        currentBuild.result = 'FAILURE'
        throw e
    } finally {
        deleteDir()
        sendEmail(EMAIL_RECIPIENTS)
    }
}

// FONCTIONS UTILITAIRES EXISTANTES
def imageBuild(containerName, tag) {
    sh "docker build -t $containerName:$tag -t $containerName --pull --no-cache ."
    echo "Image build complete"
}

def pushToImage(containerName, tag, dockerUser, dockerPassword) {
    sh "docker login -u $dockerUser -p $dockerPassword"
    sh "docker tag $containerName:$tag $dockerUser/$containerName:$tag"
    sh "docker push $dockerUser/$containerName:$tag"
    echo "Image push complete"
}

// NOUVELLES FONCTIONS POUR GITOPS
def updateGitOpsManifests(containerName, tag, envName, gitUser, gitPassword) {
    // Cloner le repository GitOps
    sh "git clone https://$gitUser:$gitPassword@github.com/stevymonkam/kubernetes-argocd-angular-javasprintboot.git gitops-repo"

    
    dir('gitops-repo') {
        // Configurer Git
        sh "git config user.name '${env.GIT_AUTHOR_NAME}'"
        sh "git config user.email '${env.GIT_AUTHOR_EMAIL}'"
        
        // Mettre à jour le manifeste Kubernetes selon l'environnement
       // Déterminer le chemin selon la structure Kustomize
        def overlayPath = "apps/frontend/overlays/${envName}"
        def kustomizationFile = "${overlayPath}/kustomization.yaml"
        
        // Vérifier que l'environnement existe
        sh "test -d ${overlayPath} || (echo 'Environment ${envName} not found' && exit 1)"
        
        // Méthode 1: Utiliser kustomize edit pour mettre à jour l'image
        dir(overlayPath) {
            sh "kustomize edit set image ${containerName}=${dockerUser}/${containerName}:${tag}"
        }

        sh "git diff"

         // Afficher le contenu du kustomization.yaml pour debug
        sh "echo '=== Updated kustomization.yaml for ${envName} ==='"
        sh "cat ${kustomizationFile}"
        
        // Commit et push
        sh "git add ."
        sh "git commit -m 'Update ${envName} ${containerName} image to ${tag} - Build #${env.BUILD_NUMBER}'"
        sh "git push origin ${targetBranch}"
        
        echo "GitOps repository updated successfully"
    }
}


def verifyArgoCDDeployment(envName) {
    def appName = "angular-${envName}-app"
    
    withCredentials([usernamePassword(credentialsId: 'argocd-credentials', usernameVariable: 'ARGOCD_USERNAME', passwordVariable: 'ARGOCD_PASSWORD')]) {
        try {
            // Vérifier le statut de l'application
            def appStatus = sh(script: "argocd app get ${appName} -o json | jq -r '.status.health.status'", returnStdout: true).trim()
            
            if (appStatus == "Healthy") {
                echo "✅ Déploiement vérifié: Application ${appName} est en bonne santé"
            } else {
                echo "⚠️  Attention: Application ${appName} status: ${appStatus}"
            }
            
            // Obtenir l'URL de l'application
            def appUrl = getApplicationUrl(envName)
            echo "🌐 Application accessible à: ${appUrl}"
            
        } catch (Exception e) {
            echo "Warning: Could not verify deployment status: ${e.message}"
        }
    }
}

def getApplicationUrl(envName) {
    if (envName == 'prod') {
        return "https://angular-app.votre-domaine.com"
    } else if (envName == 'uat') {
        return "https://angular-app-uat.votre-domaine.com"
    } else {
        return "https://angular-app-dev.votre-domaine.com"
    }
}

def sendEmail(recipients) {
    def appUrl = getApplicationUrl(ENV_NAME)
    mail(
        to: recipients,
        subject: "Angular Build ${env.BUILD_NUMBER} - ${currentBuild.currentResult} - (${currentBuild.fullDisplayName})",
        body: "Check console output at: ${env.BUILD_URL}/console\n" +
              "Environment: ${ENV_NAME}\n" +
              "Docker Image: ${CONTAINER_NAME}:${CONTAINER_TAG}\n" +
              "Application URL: ${appUrl}\n" +
              "ArgoCD App: angular-app-${ENV_NAME}\n"
    )
}

// FONCTIONS UTILITAIRES EXISTANTES
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