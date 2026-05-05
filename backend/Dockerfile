FROM node:20-alpine

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем prisma схему и генерируем клиент
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate

# Копируем исходники и собираем
COPY . .
RUN npm run build

# Запускаем: применяем миграции + стартуем
CMD npx prisma migrate deploy && node dist/main
