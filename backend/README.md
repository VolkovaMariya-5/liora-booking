# Liora — Backend (NestJS)

REST API для платформы онлайн-записи **Liora**.

## Технологии

- **NestJS 10** (TypeScript, модульная архитектура)
- **Prisma ORM** + **PostgreSQL**
- **Passport.js** + **JWT** — аутентификация
- **bcryptjs** — хеширование паролей
- **Swagger / OpenAPI** — документация API
- **Cloudinary** — хранение изображений

## Запуск локально

```bash
# 1. Установить зависимости
npm install

# 2. Создать .env из примера
cp .env.example .env
# Заполнить DATABASE_URL, JWT_SECRET и др.

# 3. Применить миграции и заполнить тестовыми данными
npx prisma migrate dev
npx prisma db seed

# 4. Запустить dev-сервер
npm run start:dev
# → http://localhost:3001
# → Swagger UI: http://localhost:3001/api/docs
```

## Переменные окружения

| Переменная | Описание |
|---|---|
| `DATABASE_URL` | Строка подключения к PostgreSQL |
| `JWT_SECRET` | Секрет для JWT (минимум 32 символа) |
| `JWT_EXPIRES_IN` | Время жизни токена (например: `7d`) |
| `PORT` | Порт сервера (по умолчанию `3001`) |
| `CORS_ORIGIN` | URL фронтенда для CORS |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret |

## Структура API

| Модуль | Базовый путь | Описание |
|---|---|---|
| Auth | `/api/auth` | Регистрация, вход, профиль |
| Businesses | `/api/businesses` | Публичный каталог бизнесов |
| Staff | `/api/staff` | Мастера и доступные слоты |
| Bookings | `/api/bookings` | Записи клиентов |
| Reviews | `/api/reviews` | Отзывы |
| Favorites | `/api/favorites` | Избранные мастера |
| Manage | `/api/manage` | Кабинет владельца бизнеса |
| Profile | `/api/profile` | Профиль пользователя |
| Upload | `/api/upload` | Загрузка изображений |
| Admin | `/api/admin` | Административные операции |

Полная документация: `GET /api/docs`

## Схема БД (Prisma)

10 моделей: `User`, `Business`, `Staff`, `Service`, `StaffService`, `Booking`, `BookingItem`, `Schedule`, `Favorite`, `Review`

Связи: `User 1:N Booking`, `Business 1:N Staff`, `Staff N:M Service` (через StaffService) и др.
