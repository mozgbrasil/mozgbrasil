# Estágio de dependências e build
FROM node:20-alpine AS dependencies

# Define o diretório de trabalho para a aplicação
WORKDIR /app

# Copia os arquivos de manifesto (package.json e package-lock.json) primeiro
# Isso permite que o Docker cache esta camada. Ela só será invalidada se as dependências mudarem.
COPY package.json package-lock.json ./

# Instala as dependências de produção
RUN npm ci --only=production

# Estágio de execução (produção)
# Usa uma imagem mais leve que não contém ferramentas de build
FROM node:20-alpine AS final

# Define o diretório de trabalho
WORKDIR /app

# Copia as dependências instaladas do estágio anterior
COPY --from=dependencies /app/node_modules ./node_modules

# Copia os arquivos de código-fonte
COPY . .

# Expõe a porta que a aplicação irá usar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "src/index.js"]
