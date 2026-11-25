
# Utiliza uma imagem oficial do Node.js.
FROM node:22-slim

# Define a pasta de trabalho.
WORKDIR /app

# Copia os arquivos de dependencias.
COPY package*.json ./

# Instala as dependencias de producao.
RUN npm ci --omit=dev

# Copia os arquivos da aplicacao.
COPY . .

# Executa com usuario nao privilegiado.
USER node

# Configura a porta do servidor.
ENV PORT=8080

EXPOSE 8080

# Inicializa o Gateway.
CMD ["node", "server.js"]
