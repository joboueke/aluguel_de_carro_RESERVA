
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        APP_NAME = 'reserva-api'
    }

    stages {
        stage('Checkout GitHub') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/joboueke/aluguel_de_carro_RESERVA.git'
                    ]]
                ])
            }
        }

        stage('Fetch Secrets - Infisical') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'infisical-rentcar-reserva',
                        variable: 'INFISICAL_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x
                        set -eu
                        umask 077

                        rm -f .env

                        npx -y @infisical/cli export \
                            --env="dev" \
                            --path="/" \
                            --format=dotenv \
                            --token="$INFISICAL_TOKEN" \
                            > .env

                        test -s .env || {
                            echo "ERRO: .env vazio."
                            exit 1
                        }

                        for VAR in DB_URL DB_USUARIO DB_USUARIO_SENHA RESERVA; do
                            if ! grep -q "^${VAR}=" .env; then
                             echo "ERRO: Variável ${VAR} não encontrada no Infisical."
                            exit 1
                            fi
                        done

                        echo "Segredos carregados e variáveis obrigatórias encontradas."
                    '''
                }
            }
        }

        stage('Validar Docker Compose') {
            steps {
        sh 'docker compose --env-file .env config --quiet'
            }
        }

        stage('Construir Imagem Docker') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy Docker') {
            steps {
                sh 'docker compose --env-file .env up -d --no-build --force-recreate'
            }
        }

        stage('Verificar Container') {
            steps {
                sh '''
                    set -eu

                    sleep 10

                    RUNNING=$(docker inspect \
                        --format '{{.State.Running}}' \
                        "$APP_NAME")

                    if [ "$RUNNING" != "true" ]; then
                        echo "ERRO: Container não está rodando."
                        docker compose logs --tail=50
                        exit 1
                    fi

                    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
                        http://localhost:7543/reservas) || {
                        echo "ERRO: Não foi possível conectar à API de Reservas."
                        exit 1
                    }
                    if [ "$HTTP_STATUS" != "200" ]; then
                        echo "ERRO: API retornou HTTP $HTTP_STATUS."
                        exit 1
                    fi

                    echo "Container em execução e API respondendo HTTP 200."
                    docker compose ps
                '''
            }
        }
    }

    post {
        success {
            echo 'Deploy do microserviço de Reservas concluído.'
        }

        failure {
            echo 'Falha no pipeline do microserviço de Reservas.'
        }

        always {
            sh 'rm -f .env'
        }
    }
}
