FROM node:18

# Criar diretório da aplicação
WORKDIR /app

# Copiar os arquivos
COPY package*.json ./
RUN npm install

COPY . .

# Expõe a porta da API (ex: 3000)
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]
