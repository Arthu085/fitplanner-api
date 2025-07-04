# Imagem base
FROM node:18

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos package.json e lock
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todos os arquivos
COPY . .

# Gerar o client do Prisma
RUN npx prisma generate

# Expor a porta usada no Express
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
