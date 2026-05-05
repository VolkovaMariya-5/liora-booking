FROM node:20-alpine

WORKDIR /app

# Копируем prisma раньше — нужен schema.prisma для postinstall
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем исходники
COPY . .

# Компилируем TypeScript напрямую через tsc (минуя nest build)
RUN npx tsc -p tsconfig.build.json

# Проверяем что dist/main.js создался
RUN test -f dist/main.js && echo "✓ dist/main.js exists" || (echo "✗ dist/main.js NOT FOUND" && ls -la dist/ && exit 1)

CMD npx prisma migrate deploy && node dist/main
