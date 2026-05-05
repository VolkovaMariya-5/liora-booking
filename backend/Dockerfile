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

# tsc кладёт в dist/src/main.js (сохраняет структуру папок)
RUN test -f dist/src/main.js && echo "✓ dist/src/main.js exists" || (echo "✗ NOT FOUND" && find dist/ -name "*.js" | head -5 && exit 1)

CMD npx prisma migrate deploy && node dist/src/main
