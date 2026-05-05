FROM node:20-alpine

WORKDIR /app

# Копируем package.json, prisma схему и конфиг до npm ci,
# чтобы postinstall (prisma generate) нашёл schema.prisma
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npm ci

# Копируем исходники и собираем
COPY . .
RUN npm run build

# Запускаем: применяем миграции + стартуем
CMD npx prisma migrate deploy && node dist/main
