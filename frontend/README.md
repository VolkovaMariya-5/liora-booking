# Liora — Frontend (Next.js)

Клиентская часть платформы онлайн-записи **Liora**. Записывайтесь к мастерам салонов красоты, барбершопов и SPA — без звонков, в любое время.

## Технологии

- **Next.js 15** (App Router, Server Components)
- **NextAuth.js v5** — аутентификация (Credentials + JWT)
- **Tailwind CSS** — стилизация
- **shadcn/ui** + **Base UI** — компоненты
- **Axios** — HTTP-клиент
- **TypeScript** (strict mode)

## Запуск локально

```bash
# 1. Установить зависимости
npm install

# 2. Создать .env.local из примера
cp .env.example .env.local
# Заполнить значения (NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET и др.)

# 3. Запустить dev-сервер
npm run dev
# → http://localhost:3000
```

## Переменные окружения

| Переменная | Описание |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL бэкенда (например: `http://localhost:3001/api`) |
| `NEXTAUTH_SECRET` | Секрет для NextAuth (минимум 32 символа) |
| `NEXTAUTH_URL` | URL фронтенда (например: `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (опционально) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret (опционально) |

## Структура проекта

```
frontend/
├── app/
│   ├── (main)/          # Публичные страницы с хедером
│   │   ├── page.tsx     # Лендинг
│   │   ├── businesses/  # Каталог и страницы бизнесов
│   │   ├── bookings/    # Записи клиента
│   │   ├── manage/      # Кабинет владельца бизнеса
│   │   ├── admin/       # Кабинет супер-администратора
│   │   └── staff/       # Кабинет мастера
│   ├── auth/            # Страницы входа и регистрации
│   └── actions/         # Server Actions
├── components/
│   ├── layout/          # Header, Footer, CitySelector
│   ├── shared/          # Stepper, DayPicker, TimeSlot и др.
│   ├── businesses/      # BusinessCard
│   └── ui/              # shadcn/ui компоненты
└── lib/
    ├── api.ts           # Axios instance с JWT interceptor
    ├── auth.ts          # NextAuth config
    └── constants.ts     # Категории, города, getCurrency
```

## Роли пользователей

| Роль | Доступ |
|---|---|
| `CLIENT` | Каталог, запись, отзывы, избранное |
| `STAFF` | Своё расписание и записи |
| `BUSINESS_ADMIN` | Управление мастерами, услугами, записями |
| `SUPER_ADMIN` | Полная статистика, управление всеми бизнесами и пользователями |

## Тестовые аккаунты (seed-данные)

| Email | Пароль | Роль |
|---|---|---|
| `admin@liora.app` | `Admin123!` | SUPER_ADMIN |
| `owner.belle@example.com` | `Business123!` | BUSINESS_ADMIN |
| `anna@example.com` | `Client123!` | CLIENT |
