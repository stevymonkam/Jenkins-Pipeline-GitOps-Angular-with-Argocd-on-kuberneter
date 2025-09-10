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

  stage('Setup Tools') {
    echo "Setup Tools: docker & node & kustomize"
    def dockerHome = tool 'dockerlatest'
    def nodeHome = tool 'nodelatest'
    env.PATH = "${dockerHome}/bin:${nodeHome}/bin:${env.WORKSPACE}/bin:${env.PATH}"

      // Installation de jq
                sh '''
                    if ! command -v jq &> /dev/null; then
                        echo "Installing jq..."
                        apt-get update && apt-get install -y jq
                    fi
                '''
                
                // Installation d'ArgoCD CLI
                sh '''
                    if ! command -v argocd &> /dev/null; then
                        echo "Installing ArgoCD CLI..."
                        curl -sSL -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
                        chmod +x /usr/local/bin/argocd
                    fi
                '''

    sh '''
        # Installer kustomize localement si nécessaire
        if ! command -v kustomize &> /dev/null; then
            echo "Installing Kustomize..."
            curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
            mkdir -p bin
            mv kustomize bin/
        fi
    '''
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
        /*stage('Update GitOps Repository') {
            withCredentials([usernamePassword(credentialsId: 'gitops-credentials-argocd', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                updateGitOpsManifests(CONTAINER_NAME, CONTAINER_TAG, ENV_NAME, GIT_USERNAME, GIT_PASSWORD)
            }
        }*/

        // ===== CONTENEURISATION ET GITOPS (ENSEMBLE) =====
        stage('GitOps Update') {
            withCredentials([
                usernamePassword(credentialsId: 'dockerhubcredential', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD'),
                usernamePassword(credentialsId: 'gitops-credentials-argocd', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD'),
                usernamePassword(credentialsId: 'github-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')
            ]) {
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

def updateGitOpsManifests(containerName, tag, envName, gitUser, gitPassword) {
    def dockerUser = env.USERNAME
    def GIT_TOKEN = env.GIT_TOKEN
    def GIT_USER = env.GIT_USER
    if (!dockerUser?.trim()) {
        error("❌ env.USERNAME (DockerHub username) is not set. Make sure you're inside a 'withCredentials' block.")
    }
   def targetBranch = 'feature'
   

     

    echo "🔧 Updating GitOps manifests for ${envName} with image: ${dockerUser}/${containerName}:${tag}"

    sh "git clone https://${gitUser}:${gitPassword}@github.com/stevymonkam/kubernetes-argocd-angular-javasprintboot.git gitops-repo"

    dir('gitops-repo') {
        // Config Git
        sh "git config user.name '${env.GIT_AUTHOR_NAME ?: "Jenkins CI"}'"
        sh "git config user.email '${env.GIT_AUTHOR_EMAIL ?: "jenkins@ci.local"}'"

        // Vérifie et exporte kustomize dans le PATH
        sh '''
            echo "🔍 Verifying kustomize installation..."
            if [ -f $HOME/bin/kustomize ]; then
                export PATH=$HOME/bin:$PATH
            fi
            command -v kustomize || { echo '❌ kustomize not found in PATH'; exit 1; }
            kustomize version
        '''
        sh '''
            echo "🔍 Affichage du contenu clôné :"
            pwd
            ls -la
            echo "--- apps ---"
            ls -la apps || echo "Dossier apps inexistant"
            echo "--- apps/frontend ---"
            ls -la apps/frontend || echo "Dossier apps/frontend inexistant"
            echo "--- apps/frontend/overlays ---"
            ls -la apps/frontend/overlays || echo "Dossier apps/frontend/overlays inexistant"
        '''

       
        echo "🔍 Switching to GitOps target branch: ${targetBranch}"

        echo "🔍 Voici ou il ta erreur..11."
        // Checkout de la branche GitOps cible
       // sh "git checkout -B ${targetBranch}"

        echo "🔍 Voici ou il ta erreur...22"

        // Définir le chemin d’overlay
        def overlayPath = "apps/frontend/overlays/${envName}"
        def kustomizationFile = "${overlayPath}/kustomization.yaml"

        // Vérifie que l'overlay existe
        sh "test -d ${overlayPath} || (echo '❌ Environment overlay ${envName} not found'; ls -la apps/frontend/overlays/; exit 1)"

        // Modifier l’image via kustomize
        dir(overlayPath) {
            sh """
                echo "🛠️ Updating image in ${overlayPath}/kustomization.yaml"
                if [ -f \$HOME/bin/kustomize ]; then
                    export PATH=\$HOME/bin:\$PATH
                fi
                kustomize edit set image ${containerName}=${dockerUser}/${containerName}:${tag}
            """
        }

        // Vérifier les modifications
        sh "git diff"

        // Afficher le fichier final modifié
        sh "echo '✅ Updated kustomization.yaml:' && cat ${kustomizationFile}"

        // Commit et push
        sh "git add ."
        sh "git commit -m 'Update ${envName} ${containerName} image to ${tag} - Build #${env.BUILD_NUMBER}' || echo 'ℹ️ Nothing to commit'"
        sh '''
            git config user.email "stevy.monkam@yahoo.fr"
            git config user.name "$GIT_USER"
            git remote set-url origin https://$GIT_USER:$GIT_TOKEN@github.com/stevymonkam/kubernetes-argocd-angular-javasprintboot.git
            git push origin main
          '''

        echo "✅ GitOps repository updated and pushed successfully"
    }
}

def verifyArgoCDDeployment(envName) {
    def appName = "angular-${envName}-app"
    def ARGOCD_SERVER = '109.176.198.187:30000'  
    
    withCredentials([usernamePassword(credentialsId: 'argocd-credentials', usernameVariable: 'ARGOCD_USERNAME', passwordVariable: 'ARGOCD_PASSWORD')]) {
        try {
            echo "🔐 Connexion à ArgoCD pour vérifier l'application: ${appName}"
            
            // Login ArgoCD avec les variables def
            sh """
                echo "🔐 Connexion à ArgoCD: ${ARGOCD_SERVER}"
                argocd login ${ARGOCD_SERVER} \
                    --username \${ARGOCD_USERNAME} \
                    --password \${ARGOCD_PASSWORD} \
                    --insecure
            """
            
            echo "✅ Connexion ArgoCD réussie"
            
            // 🔍 Debug: Afficher les informations complètes de l'application
            echo "🔍 Debug: Récupération des infos complètes de l'application ${appName}"
            sh """
                echo "📋 === INFORMATIONS COMPLÈTES DE L'APPLICATION ==="
                argocd app get ${appName} -o yaml || echo "❌ Impossible de récupérer les infos de ${appName}"
            """
            
            // Vérifier le statut de santé de l'application
            echo "🔍 Vérification du statut de santé..."
            def appStatus = sh(
                script: "argocd app get ${appName} -o json | jq -r '.status.health.status'", 
                returnStdout: true
            ).trim()
            
            echo "📊 Statut de santé récupéré: '${appStatus}'"
            
            // Vérifier le statut de synchronisation
            def syncStatus = sh(
                script: "argocd app get ${appName} -o json | jq -r '.status.sync.status'",
                returnStdout: true
            ).trim()
            
            echo "🔄 Statut de synchronisation: '${syncStatus}'"
            
            // Évaluation du statut de santé
            switch(appStatus) {
                case "Healthy":
                    echo "✅ Déploiement vérifié: Application ${appName} est en bonne santé"
                    break
                case "Progressing":
                    echo "🔄 Application ${appName} en cours de déploiement"
                    echo "ℹ️  Cela peut prendre quelques minutes..."
                    break
                case "Degraded":
                    echo "⚠️  Attention: Application ${appName} dégradée"
                    echo "🔍 Vérifiez les logs et les ressources Kubernetes"
                    break
                case "":
                case "null":
                    echo "❌ Impossible de récupérer le statut de santé pour ${appName}"
                    echo "🔍 L'application existe-t-elle dans ArgoCD ?"
                    break
                default:
                    echo "❓ Statut de santé inconnu pour ${appName}: '${appStatus}'"
            }
            
            // Évaluation du statut de synchronisation
            switch(syncStatus) {
                case "Synced":
                    echo "✅ Application ${appName} synchronisée avec Git"
                    break
                case "OutOfSync":
                    echo "🔄 Application ${appName} pas synchronisée - Déploiement en attente"
                    break
                case "Unknown":
                    echo "❓ Statut de synchronisation inconnu"
                    break
                default:
                    echo "🔄 Statut de sync: ${syncStatus}"
            }
            
            // Obtenir l'URL de l'application
            def appUrl = getApplicationUrl(envName)
            echo "🌐 Application devrait être accessible à: ${appUrl}"
            
            // Afficher un résumé
            echo """
            📊 === RÉSUMÉ DE LA VÉRIFICATION ===
            🎯 Application: ${appName}
            💚 Santé: ${appStatus}
            🔄 Sync: ${syncStatus}
            🌐 URL: ${appUrl}
            🏷️  Environnement: ${envName}
            ====================================
            """
            
            // Déconnexion propre
            sh "argocd logout || echo 'Déjà déconnecté'"
            
        } catch (Exception e) {
            echo "❌ Erreur lors de la vérification ArgoCD: ${e.getMessage()}"
            echo "🔍 Détails de l'erreur:"
            echo "${e}"
            
            // Essayer de récupérer des infos de debug
            try {
                echo "🔍 Tentative de récupération d'informations de debug..."
                sh """
                    echo "=== Test de connectivité ArgoCD ==="
                    curl -k -I ${ARGOCD_SERVER} || echo "Impossible de joindre ${ARGOCD_SERVER}"
                    
                    echo "=== Version ArgoCD CLI ==="
                    argocd version --client || echo "ArgoCD CLI indisponible"
                    
                    echo "=== Liste des applications ArgoCD (si connecté) ==="
                    argocd app list || echo "Impossible de lister les applications"
                """
            } catch (Exception debugException) {
                echo "❌ Impossible de récupérer les infos de debug: ${debugException.getMessage()}"
            }
            
            // Ne pas faire échouer le pipeline pour la vérification
            echo "⚠️  Continuing pipeline despite verification failure..."
        }
    }
}

// FONCTION 1: Installation de Kustomize
def installKustomize() {
    sh '''
        # Vérifier si kustomize est déjà installé
        if ! command -v kustomize &> /dev/null; then
            echo "Installing Kustomize..."
            
            # Télécharger et installer kustomize
            curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
            
            # Essayer de déplacer vers /usr/local/bin avec sudo
            if sudo -n true 2>/dev/null; then
                sudo mv kustomize /usr/local/bin/
            else
                # Sinon, utiliser un répertoire local
                mkdir -p $HOME/bin
                mv kustomize $HOME/bin/
                export PATH=$HOME/bin:$PATH
                echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
            fi
        fi
        
        # Vérifier l'installation
        kustomize version || echo "Kustomize installed but not in PATH"
    '''
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