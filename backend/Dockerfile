FROM node:20-alpine

WORKDIR /app

# Копируем сначала prisma — нужен schema.prisma для postinstall (prisma generate)
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Копируем package.json и устанавливаем зависимости (postinstall запустит prisma generate)
COPY package*.json ./
RUN npm ci

# Копируем исходники и собираем TypeScript
COPY . .
RUN npm run build

# При запуске: применяем миграции → стартуем
CMD npx prisma migrate deploy && node dist/main
