FROM node:20-alpine

WORKDIR /app

# Instalar pnpm globalmente en el contenedor
RUN npm install -g pnpm

# Configurar el alias solicitado para que apunte a pnpm
RUN echo "alias npm=pnpm" >> /root/.bashrc

COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias usando pnpm de forma estricta
RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
