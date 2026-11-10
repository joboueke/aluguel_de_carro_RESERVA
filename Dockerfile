
FROM node:24-bookworm-slim

WORKDIR /app

# Dependências necessárias ao Prisma
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Instala as dependências do projeto
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copia o código-fonte
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Compila o NestJS
RUN npm run build

# Porta utilizada pela aplicação
EXPOSE 7543

# Inicia a aplicação
CMD ["npm", "run", "start:prod"]
