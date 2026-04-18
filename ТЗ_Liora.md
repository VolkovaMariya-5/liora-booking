# Техническое задание: Liora

**Liora** — мульти-тенантная SaaS-платформа онлайн-записи для сервисных бизнесов (барбершопы, салоны красоты, nail-студии, массажисты и др.).

---

## 1. Стек технологий

| Слой | Технология |
|---|---|
| Frontend | Next.js 14+ (App Router) |
| Backend | NestJS 10+ (TypeScript) |
| База данных | PostgreSQL |
| ORM | Prisma |
| Аутентификация (backend) | NestJS + Passport.js + JWT (`passport-local`, `passport-jwt`) |
| Аутентификация (frontend) | NextAuth.js v5 (Auth.js) — Credentials Provider + Google OAuth |
| Стилизация | Tailwind CSS + shadcn/ui |
| Деплой Frontend | Vercel |
| Деплой Backend | Railway / Render |
| Деплой БД | Railway / Supabase |
| Хранение файлов | Cloudinary (фото мастеров) |

---

## 2. Роли пользователей

| Роль | Описание |
|---|---|
| `SUPER_ADMIN` | Администратор платформы Liora. Видит все бизнесы, может блокировать/разблокировать |
| `BUSINESS_ADMIN` | Владелец бизнеса. Управляет своими мастерами, услугами, расписанием, записями |
| `STAFF` | Мастер. Видит своё расписание и свои записи |
| `CLIENT` | Клиент. Регистрируется, выбирает бизнес, записывается к мастеру |

---

## 3. Основные сущности (схема БД)

### 3.1 User
```
id            String   @id @default(uuid())
email         String   @unique
passwordHash  String
name          String
phone         String?
avatarUrl     String?
role          Role     @default(CLIENT)
country       String?  // "RU", "BY", "KZ" и т.д.
city          String?  // "Москва", "Минск" и т.д.
isDeleted     Boolean  @default(false)
deletedAt     DateTime?
createdAt     DateTime @default(now())
updatedAt     DateTime @updatedAt

// Relations
ownedBusiness  Business?        (BUSINESS_ADMIN)
staffProfile   Staff?           (STAFF)
bookings       Booking[]        (CLIENT)
favorites      Favorite[]       (CLIENT)
reviews        Review[]         (CLIENT)
```

### 3.2 Business
```
id                    String           @id @default(uuid())
name                  String
slug                  String           @unique
description           String?
address               String?
phone                 String?
logoUrl               String?
category              BusinessCategory
country               String           // "RU", "BY", "KZ" и т.д.
city                  String           // "Москва", "Минск" и т.д.
isActive              Boolean          @default(true)
isVisible             Boolean          @default(false) // true только когда есть мастер + услуга
maxAdvanceBookingDays Int              @default(30)    // глубина бронирования (настраивается)
ownerId               String           @unique
createdAt             DateTime         @default(now())

// Relations
owner       User
staff       Staff[]
services    Service[]
bookings    Booking[]
```

### Enum: BusinessCategory
```
BARBERSHOP        // Барбершоп
BEAUTY_SALON      // Салон красоты
NAIL_STUDIO       // Nail-студия
LASH_STUDIO       // Lash-студия
MASSAGE           // Массаж
COSMETOLOGY       // Косметология
FITNESS           // Фитнес / персональный тренер
OTHER             // Другое
```

### 3.3 Staff
```
id          String   @id @default(uuid())
userId      String   @unique
businessId  String
bio         String?
photoUrl    String?
isActive    Boolean  @default(true)

// Relations
user        User
business    Business
services    StaffService[]   (M:N с Service)
bookings    Booking[]
schedules   Schedule[]
```

### 3.4 Service
```
id          String   @id @default(uuid())
businessId  String
name        String
description String?
price       Decimal
duration    Int      // в минутах
isActive    Boolean  @default(true)

// Relations
business    Business
staff       StaffService[]   (M:N со Staff)
bookingItems BookingItem[]
```

### 3.5 StaffService (M:N)
```
staffId     String
serviceId   String
// Составной PK: (staffId, serviceId)
```

### 3.6 Booking
```
id          String        @id @default(uuid())
clientId    String
staffId     String
businessId  String
date        DateTime
startTime   String        // "10:00"
endTime     String        // "11:30" (вычисляется по услугам)
totalPrice  Decimal
totalDuration Int         // суммарная длительность в минутах
status      BookingStatus @default(PENDING)
notes       String?
createdAt   DateTime      @default(now())

// Relations
client      User
staff       Staff
business    Business
items       BookingItem[]
```

### 3.7 BookingItem
```
id          String   @id @default(uuid())
bookingId   String
serviceId   String
price       Decimal  // цена на момент записи
duration    Int      // длительность на момент записи

// Relations
booking     Booking
service     Service
```

### 3.8 Schedule (рабочие дни мастера)
```
id          String   @id @default(uuid())
staffId     String
dayOfWeek   Int      // 0=Вс, 1=Пн, ... 6=Сб
startTime   String   // "09:00"
endTime     String   // "18:00"
isWorking   Boolean  @default(true)
```

### 3.9 Favorite
```
id         String   @id @default(uuid())
clientId   String
staffId    String
createdAt  DateTime @default(now())

// Составной уникальный индекс: (clientId, staffId)
// Relations
client     User
staff      Staff
```

### 3.10 Review
```
id          String   @id @default(uuid())
bookingId   String   @unique
clientId    String
staffId     String
businessId  String
rating      Int      // 1-5
comment     String?
createdAt   DateTime @default(now())
```

### Enum: BookingStatus
```
PENDING     // ожидает подтверждения
CONFIRMED   // подтверждена мастером / автоматически
CANCELLED   // отменена
COMPLETED   // выполнена
```

### Enum: Role
```
SUPER_ADMIN
BUSINESS_ADMIN
STAFF
CLIENT
```

---

## 4. API эндпоинты (NestJS)

### Auth
```
POST   /api/auth/register         Регистрация клиента (email + пароль)
POST   /api/auth/register-business Регистрация владельца бизнеса
POST   /api/auth/login            Вход — вызывается NextAuth Credentials Provider
                                  Возвращает: { user: {...}, accessToken: "jwt..." }
POST   /api/auth/google           Вход через Google — вызывается NextAuth Google Provider
                                  Принимает: { googleId, email, name, avatarUrl }
                                  Создаёт или находит пользователя, возвращает accessToken
GET    /api/auth/me               Текущий пользователь (защищён JwtAuthGuard)
```

### Businesses
```
GET    /api/businesses                    Список видимых бизнесов (публично, пагинация)
                                          Query params: ?page=1&limit=12&search=&category=&city=
GET    /api/businesses/:slug              Страница бизнеса (публично)
POST   /api/businesses                    Создать бизнес (BUSINESS_ADMIN регистрация)
PATCH  /api/businesses/:id                Обновить бизнес (владелец / SUPER_ADMIN)
DELETE /api/businesses/:id                Удалить бизнес (SUPER_ADMIN)
PATCH  /api/businesses/:id/toggle         Заблокировать / разблокировать (SUPER_ADMIN)
PATCH  /api/businesses/:id/settings       Настройки: maxAdvanceBookingDays и др. (владелец)
```

### Staff
```
GET    /api/businesses/:id/staff         Список мастеров бизнеса (публично)
GET    /api/staff/:id                    Профиль мастера (публично)
POST   /api/businesses/:id/staff         Добавить мастера (BUSINESS_ADMIN)
PATCH  /api/staff/:id                    Обновить мастера (BUSINESS_ADMIN)
DELETE /api/staff/:id                    Удалить мастера (BUSINESS_ADMIN)
GET    /api/staff/:id/available-slots    Свободные слоты мастера на дату
```

### Services
```
GET    /api/businesses/:id/services      Список услуг бизнеса (публично)
POST   /api/businesses/:id/services      Создать услугу (BUSINESS_ADMIN)
PATCH  /api/services/:id                 Обновить услугу (BUSINESS_ADMIN)
DELETE /api/services/:id                 Удалить услугу (BUSINESS_ADMIN)
```

### Bookings
```
GET    /api/bookings                     Мои записи (CLIENT — свои, STAFF — свои, ADMIN — все в бизнесе)
GET    /api/bookings/:id                 Детали записи
POST   /api/bookings                     Создать запись (CLIENT)
PATCH  /api/bookings/:id/status          Изменить статус (STAFF / BUSINESS_ADMIN)
DELETE /api/bookings/:id                 Отменить запись (CLIENT — свою, ADMIN — любую)
```

### Reviews
```
POST   /api/reviews                      Оставить отзыв (CLIENT, после COMPLETED)
GET    /api/businesses/:id/reviews       Отзывы о бизнесе (публично)
DELETE /api/reviews/:id                  Удалить отзыв (SUPER_ADMIN)
```

### Profile (CLIENT)
```
GET    /api/profile                      Получить свой профиль
PATCH  /api/profile                      Обновить имя, телефон, аватар
PATCH  /api/profile/password             Сменить пароль (старый + новый)
DELETE /api/profile                      Удалить аккаунт (soft delete)
```

### Favorites (CLIENT)
```
GET    /api/favorites                    Список избранных мастеров
POST   /api/favorites/:staffId           Добавить мастера в избранное
DELETE /api/favorites/:staffId           Убрать мастера из избранного
```

### Admin (SUPER_ADMIN)
```
GET    /api/admin/businesses             Все бизнесы с фильтрацией
GET    /api/admin/users                  Все пользователи
GET    /api/admin/stats                  Статистика платформы
```

---

## 5. Страницы (Next.js App Router)

### Публичные
```
/                          Лендинг: описание платформы, CTA, примеры
/auth/login                Вход
/auth/register             Регистрация клиента
/businesses                Каталог бизнесов (поиск, фильтрация)
/businesses/[slug]         Страница бизнеса: мастера, услуги, отзывы
/businesses/[slug]/book    Форма записи: выбор мастера → услуг → даты/времени
```

### Защищённые — Клиент
```
/dashboard                 Личный кабинет: ближайшие записи
/bookings                  Все мои записи (список с пагинацией)
/bookings/[id]             Детали записи, кнопка отмены
/profile                   Профиль клиента (см. раздел 7)
/profile/edit              Редактирование личных данных
/profile/password          Смена пароля
/favorites                 Избранные мастера
```

### Защищённые — STAFF
```
/staff/dashboard           Расписание на сегодня / неделю
/staff/bookings            Все записи ко мне (с фильтром по статусу)
/staff/schedule            Управление рабочими часами
```

### Защищённые — BUSINESS_ADMIN
```
/manage                    Обзор: записи сегодня, выручка, мастера
/manage/staff              Список мастеров, добавить/редактировать
/manage/services           Список услуг, добавить/редактировать
/manage/bookings           Все записи бизнеса
/manage/settings           Настройки бизнеса (название, описание, лого)
```

### Защищённые — SUPER_ADMIN
```
/admin                     Дашборд: количество бизнесов, пользователей
/admin/businesses          Все бизнесы, фильтрация, блокировка
/admin/users               Все пользователи
```

### Системные
```
/not-found                 404 — кастомная страница
```

---

## 6. Сценарии использования

> Каждый сценарий описывает **основной поток** (happy path) и **альтернативные потоки** (ошибки, граничные случаи).

---

### 6.1 Регистрация клиента

**Основной поток:**
1. Пользователь открывает `/auth/register`
2. Заполняет форму:
   - Имя (обязательно)
   - Email (обязательно)
   - Пароль + подтверждение (обязательно)
   - Страна — выпадающий список (обязательно, по умолчанию Россия)
   - Город — выпадающий список, зависит от выбранной страны (обязательно)
3. Нажимает "Зарегистрироваться"
4. Backend создаёт пользователя с ролью `CLIENT`, возвращает JWT
5. Фронтенд сохраняет в NextAuth сессию
6. Редирект на `/dashboard` — каталог и контент сразу отфильтрованы по городу клиента

**Альтернативные потоки:**
- **Email уже занят** → Backend возвращает 409: "Пользователь с таким email уже существует. Войдите или восстановите пароль"
- **Пароли не совпадают** → Inline-ошибка на клиенте до отправки
- **Слабый пароль** (< 8 символов или без цифры) → Inline-ошибка под полем
- **Город не выбран** → Форма не отправляется, поле подсвечивается красным
- **Сетевая ошибка** → Toast: "Не удалось подключиться к серверу. Попробуйте позже"

---

### 6.2 Вход в систему

**Основной поток:**
1. Пользователь открывает `/auth/login`
2. Вводит email и пароль
3. Backend проверяет credentials, возвращает JWT
4. Редирект: CLIENT → `/dashboard`, STAFF → `/staff/dashboard`, BUSINESS_ADMIN → `/manage`, SUPER_ADMIN → `/admin`

**Альтернативные потоки:**
- **Неверный email или пароль** → Toast: "Неверный email или пароль" (не уточнять какое именно — безопасность)
- **Аккаунт заблокирован** (бизнес деактивирован SUPER_ADMIN) → Toast: "Ваш аккаунт заблокирован. Обратитесь в поддержку"
- **Попытка доступа к защищённому маршруту без авторизации** → Редирект на `/auth/login?redirect=/bookings` (после входа вернуть на исходную страницу)

---

### 6.3 Регистрация бизнеса

**Основной поток:**
1. Владелец нажимает "Зарегистрировать бизнес" на лендинге или в хедере
2. Открывается форма:
   - Имя владельца (обязательно)
   - Email (обязательно)
   - Пароль + подтверждение (обязательно)
   - Название бизнеса (обязательно)
   - Категория — выпадающий список (обязательно)
   - Страна — выпадающий список (обязательно, по умолчанию Россия)
   - Город — выпадающий список, зависит от страны (обязательно)
   - Адрес — текстовое поле (необязательно, уточнение внутри города)
   - Телефон (необязательно)
   - Slug — автогенерируется из названия, редактируемый
3. Backend создаёт `User` (BUSINESS_ADMIN) и `Business` с привязкой страны и города
4. Редирект на `/manage` с онбординг-подсказкой: "Добавьте первого мастера"

**Альтернативные потоки:**
- **Slug уже занят** → Inline-ошибка: "Этот адрес уже занят. Попробуйте: название-города". Поле подсвечивается, предлагается 3 альтернативных slug
- **Email уже занят** → "Пользователь с таким email уже существует"
- **Некорректный slug** (спецсимволы, пробелы) → Валидация: только строчные буквы, цифры и дефис, 3–50 символов

---

### 6.4 Управление мастерами (BUSINESS_ADMIN)

#### 6.4.1 Добавление мастера

**Основной поток:**
1. BUSINESS_ADMIN открывает `/manage/staff` → кнопка "Добавить мастера"
2. Открывается форма (modal или отдельная страница):
   - Email мастера (обязательно)
   - Имя (обязательно)
   - Пароль (обязательно — ADMIN создаёт аккаунт за мастера)
   - Фото (необязательно, Cloudinary)
   - Описание/специализация (необязательно)
3. Backend создаёт `User` с ролью `STAFF` и связанный `Staff` привязанный к `businessId`
4. Мастер появляется в списке, статус `isActive: true`

**Альтернативные потоки:**
- **Email уже занят другим пользователем платформы** → "Пользователь с таким email уже зарегистрирован на платформе. Укажите другой email"
- **Загрузка фото провалилась** → Toast с ошибкой, мастер создаётся без фото

#### 6.4.2 Редактирование мастера

1. BUSINESS_ADMIN нажимает "Редактировать" в карточке мастера
2. Открывается форма с текущими данными
3. Можно изменить: имя, фото, bio, привязанные услуги, расписание
4. Сохранение → PATCH `/api/staff/:id`

**Альтернативные потоки:**
- **Изменение цены или длительности услуги** → Существующие подтверждённые `CONFIRMED` бронирования сохраняют старую цену/длительность (цена фиксируется в `BookingItem` на момент записи)

#### 6.4.3 Деактивация мастера

1. BUSINESS_ADMIN нажимает "Деактивировать" → модальное окно с предупреждением
2. Если у мастера есть будущие `CONFIRMED` или `PENDING` записи → показывается список: "У мастера X записей в будущем. При деактивации они будут отменены. Продолжить?"
3. Подтверждение → `Staff.isActive = false`, все будущие записи переводятся в `CANCELLED`
4. Мастер исчезает с публичной страницы бизнеса, его слоты больше не показываются

**Альтернативные потоки:**
- **Отмена деактивации** → Ничего не меняется
- **Мастер — единственный** → Предупреждение: "Вы деактивируете последнего мастера. Бизнес не будет принимать записи"

#### 6.4.4 Привязка услуг к мастеру

1. В форме мастера — чекбоксы с услугами бизнеса
2. ADMIN выбирает, какие услуги выполняет данный мастер
3. Сохраняется как записи в таблице `StaffService`
4. На странице записи клиент видит только те услуги, которые умеет выбранный мастер

**Альтернативные потоки:**
- **Мастеру не назначено ни одной услуги** → При попытке записи к нему: "У этого мастера пока нет услуг"

#### 6.4.5 Настройка расписания мастера

1. BUSINESS_ADMIN (или сам STAFF в `/staff/schedule`) открывает расписание
2. Для каждого дня недели: переключатель "Рабочий/Выходной" + время начала и конца
3. Сохраняется в таблице `Schedule`

**Альтернативные потоки:**
- **Время конца раньше времени начала** → Валидация: "Время окончания должно быть позже начала"
- **День не задан** → При попытке записи на этот день: слоты не показываются, день в календаре недоступен

---

### 6.5 Управление услугами (BUSINESS_ADMIN)

#### 6.5.1 Создание услуги

1. `/manage/services` → "Добавить услугу"
2. Форма: название, описание, цена (₽), длительность (мин)
3. После создания — выбрать мастеров, которые её выполняют

**Альтернативные потоки:**
- **Цена = 0** → Допустимо (бесплатная консультация)
- **Длительность = 0** → Ошибка валидации: "Длительность должна быть минимум 15 минут"

#### 6.5.2 Удаление услуги

1. BUSINESS_ADMIN нажимает "Удалить" → подтверждение
2. Если у услуги есть будущие записи (через `BookingItem`) → предупреждение: "Услуга входит в X будущих записей. Удалить нельзя, пока записи активны"
3. Если будущих записей нет → `Service.isActive = false` (soft delete, история сохраняется)

---

### 6.6 Создание записи (CLIENT)

**Основной поток:**
1. Клиент на странице бизнеса `/businesses/[slug]` выбирает мастера
2. Нажимает "Записаться" → переход на `/businesses/[slug]/book?staffId=...`
3. **Шаг 1 — Услуги:** список услуг мастера с чекбоксами. Клиент выбирает одну или несколько. Внизу показывается итог: суммарная цена и длительность
4. **Шаг 2 — Дата:** календарь с активными только рабочими днями мастера. Прошедшие даты недоступны
5. **Шаг 3 — Время:** список доступных слотов на выбранную дату (с учётом расписания и существующих записей). Шаг 30 минут
6. **Шаг 4 — Подтверждение:** итоговая карточка (мастер, услуги, дата, время, цена). Поле "Примечания" (необязательно). Кнопка "Подтвердить запись"
7. Backend создаёт `Booking` со статусом `PENDING`, создаёт `BookingItem` для каждой услуги
8. Редирект на `/bookings/[id]` с toast: "Запись создана! Ожидайте подтверждения"

**Альтернативные потоки:**
- **Клиент не авторизован** → При нажатии "Записаться" редирект на `/auth/login?redirect=/businesses/[slug]/book`
- **Нет доступных слотов на выбранную дату** → "На выбранную дату нет свободного времени. Попробуйте другую дату"
- **Слот заняли пока клиент выбирал** (race condition) → Backend возвращает 409, toast: "Это время только что заняли. Выберите другое"
- **Мастер деактивирован пока шёл процесс** → 404 на шаге подтверждения, toast с ошибкой
- **Не выбрана ни одна услуга** → Кнопка "Далее" заблокирована

---

### 6.7 Подтверждение и отмена записи

#### 6.7.1 Подтверждение мастером / BUSINESS_ADMIN

1. В `/staff/bookings` или `/manage/bookings` отображаются записи со статусом `PENDING`
2. Кнопка "Подтвердить" → статус меняется на `CONFIRMED`
3. Кнопка "Отменить" → модальное окно с полем причины → статус `CANCELLED`

#### 6.7.2 Отмена клиентом

1. Клиент на `/bookings/[id]` нажимает "Отменить запись"
2. Модальное окно: "Вы уверены? Это действие нельзя отменить"
3. Подтверждение → статус `CANCELLED`

**Альтернативные потоки:**
- **Запись уже `CONFIRMED` и визит через < 2 часов** → Отмена заблокирована: "Отменить запись можно не позднее чем за 2 часа до визита. Свяжитесь с салоном напрямую"
- **Запись уже `COMPLETED`** → Кнопки отмены нет, только "Оставить отзыв"
- **Запись уже `CANCELLED`** → Отображается бейдж "Отменена", действий нет

#### 6.7.3 Завершение визита

1. STAFF или BUSINESS_ADMIN меняет статус на `COMPLETED`
2. Клиенту становится доступна кнопка "Оставить отзыв" на `/bookings/[id]`

---

### 6.8 Оставление отзыва (CLIENT)

**Основной поток:**
1. Клиент открывает завершённую запись `/bookings/[id]`
2. Нажимает "Оставить отзыв"
3. Форма: рейтинг (1–5 звёзд, обязательно) + комментарий (необязательно, max 500 символов)
4. Отзыв появляется на странице бизнеса и в карточке мастера

**Альтернативные потоки:**
- **Отзыв уже оставлен** → Кнопка заменяется на "Редактировать отзыв" (в MVP — просто скрыть кнопку, показать текст отзыва)
- **Запись не в статусе `COMPLETED`** → Кнопка отзыва не показывается

---

### 6.9 SUPER_ADMIN: управление платформой

**Блокировка бизнеса:**
1. SUPER_ADMIN в `/admin/businesses` нажимает "Заблокировать"
2. `Business.isActive = false`
3. Бизнес пропадает из публичного каталога
4. Новые записи к мастерам этого бизнеса невозможны
5. Существующие `CONFIRMED` записи остаются (клиенты уже договорились)
6. BUSINESS_ADMIN при попытке входа видит: "Ваш аккаунт заблокирован администратором платформы"

**Альтернативные потоки:**
- **Разблокировка** → `Business.isActive = true`, бизнес снова виден в каталоге

---

## 7. Профиль клиента (CLIENT)

### 7.1 Страница /profile
Отображает:
- Аватар (с кнопкой загрузки через Cloudinary)
- Имя, email (не редактируется), телефон
- Дата регистрации
- Краткая статистика: количество записей, количество оставленных отзывов

Действия:
- Кнопка "Редактировать" → `/profile/edit`
- Кнопка "Сменить пароль" → `/profile/password`
- Кнопка "Удалить аккаунт" (с подтверждением в модальном окне)

### 7.2 Страница /profile/edit
Форма редактирования:
- Имя (обязательно, 2–50 символов)
- Телефон (необязательно, формат +7XXXXXXXXXX)
- Страна — выпадающий список
- Город — выпадающий список (зависит от страны)
- Аватар (загрузка файла, max 2MB, форматы: jpg/png/webp)

> Изменение города обновляет персонализированный контент на `/dashboard` и каталог по умолчанию.

Валидация: client-side (React Hook Form + Zod) + server-side (class-validator).

### 7.3 Страница /profile/password
Форма смены пароля:
- Текущий пароль
- Новый пароль (min 8 символов, минимум 1 цифра)
- Подтверждение нового пароля

### 7.4 Страница /favorites
- Список карточек избранных мастеров
- Каждая карточка: фото, имя, бизнес, список услуг, рейтинг
- Кнопка "Записаться" → переход на `/businesses/[slug]/book` с предвыбранным мастером
- Кнопка "Убрать из избранного" (с оптимистичным обновлением UI)
- Если избранных нет — friendly empty state с CTA "Найти мастера"

### 7.5 Иконка "В избранное" на страницах мастеров
- На странице бизнеса у каждого мастера — иконка сердечка
- Авторизованный CLIENT может добавить/убрать одним кликом
- Неавторизованный — редирект на `/auth/login`

---

## 8. Бизнес-логика

### 8.1 Расчёт слотов

- Рабочие часы мастера берутся из `Schedule` на нужный день недели
- Из рабочего времени вычитаются уже занятые записи (`CONFIRMED` / `PENDING`)
- Длительность слота = суммарная длительность выбранных услуг
- Слоты генерируются с шагом 30 минут в рамках рабочего дня
- Нельзя записаться в прошлое
- Нельзя записаться дальше чем `Business.maxAdvanceBookingDays` дней вперёд
- Все времена хранятся в UTC, отображаются в МСК (UTC+3)

### 8.2 Статусная машина Booking

| Из → В | PENDING | CONFIRMED | CANCELLED | COMPLETED |
|---|---|---|---|---|
| **PENDING** | — | STAFF, BUSINESS_ADMIN | CLIENT, STAFF, BUSINESS_ADMIN | ✗ |
| **CONFIRMED** | ✗ | — | CLIENT (за 2+ ч), STAFF, BUSINESS_ADMIN | STAFF, BUSINESS_ADMIN |
| **CANCELLED** | ✗ | ✗ | — | ✗ |
| **COMPLETED** | ✗ | ✗ | ✗ | — |

Правила:
- `CANCELLED` и `COMPLETED` — терминальные статусы, изменить нельзя
- CLIENT может отменить `CONFIRMED` только если до визита > 2 часов
- Перевод в `COMPLETED` возможен только в день визита или позже

### 8.3 Правила видимости бизнеса в каталоге

Бизнес отображается в публичном каталоге `/businesses` только если выполнены **все** условия:
1. `Business.isActive = true` (не заблокирован SUPER_ADMIN)
2. `Business.isVisible = true` (автоматически устанавливается когда добавлен хотя бы 1 активный мастер И хотя бы 1 активная услуга привязана к нему)
3. У мастера настроено расписание хотя бы на 1 день недели

`isVisible` пересчитывается автоматически при:
- Добавлении / деактивации мастера
- Добавлении / удалении услуги
- Привязке / отвязке услуги от мастера

### 8.4 Защита от дублирующих записей

При создании Booking backend проверяет:
- Нет ли у этого мастера другой записи (`PENDING` или `CONFIRMED`) в диапазоне `[startTime, endTime)` на ту же дату
- Если конфликт найден → 409 Conflict: `{ message: "Это время уже занято" }`

---

## 9. Формат API-ответов

### Успешный список с пагинацией
```json
{
  "data": [...],
  "meta": {
    "total": 48,
    "page": 1,
    "limit": 12,
    "totalPages": 4
  }
}
```

### Успешный одиночный объект
```json
{
  "data": { "id": "...", "name": "..." }
}
```

### Ошибка валидации (400)
```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password is too short"],
  "error": "Bad Request"
}
```

### Бизнес-ошибка (409, 403, 404)
```json
{
  "statusCode": 409,
  "message": "Это время уже занято",
  "error": "Conflict"
}
```

---

## 10. Навигация по ролям

### Хедер — неавторизованный пользователь
- Логотип Liora (→ `/`)
- Ссылка "Найти мастера" (→ `/businesses`)
- Кнопка "Войти" (→ `/auth/login`)
- Кнопка "Зарегистрировать бизнес" (→ `/auth/register?type=business`)

### Хедер — CLIENT
- Логотип (→ `/`)
- "Найти мастера" (→ `/businesses`)
- "Мои записи" (→ `/bookings`)
- "Избранное" (→ `/favorites`)
- Аватар + дропдаун: "Профиль" (→ `/profile`), "Выйти"

### Хедер — STAFF
- Логотип (→ `/staff/dashboard`)
- "Расписание" (→ `/staff/dashboard`)
- "Записи" (→ `/staff/bookings`)
- Аватар + дропдаун: "Выйти"

### Хедер — BUSINESS_ADMIN
- Логотип (→ `/manage`)
- "Записи" (→ `/manage/bookings`)
- "Мастера" (→ `/manage/staff`)
- "Услуги" (→ `/manage/services`)
- "Настройки" (→ `/manage/settings`)
- Аватар + дропдаун: "Выйти"

### Хедер — SUPER_ADMIN
- Логотип (→ `/admin`)
- "Бизнесы" (→ `/admin/businesses`)
- "Пользователи" (→ `/admin/users`)
- Аватар + дропдаун: "Выйти"

---

## 11. Описание ключевых страниц

### 11.1 Лендинг `/`
Секции сверху вниз:
1. **Hero** — заголовок "Запись к мастеру в 3 клика", подзаголовок, две CTA-кнопки: "Найти мастера" и "Зарегистрировать бизнес"
2. **Как это работает** — 3 шага с иконками: Выбери мастера → Выбери время → Приходи
3. **Категории** — сетка из 8 карточек с иконками категорий (барбершоп, nail, массаж...)
4. **Популярные бизнесы** — горизонтальный скролл из 6 карточек бизнесов
5. **Для бизнеса** — секция с преимуществами для владельцев + кнопка "Попробовать бесплатно"
6. **Footer** — логотип, ссылки (О платформе, Контакты), копирайт

### 11.2 Каталог `/businesses`
- **Персонализация:** если пользователь авторизован — каталог автоматически открывается с фильтром по его городу. Неавторизованный видит все бизнесы
- Поисковая строка (по названию бизнеса)
- Фильтры:
  - Страна — выпадающий список (если выбрана страна, обновляет список городов)
  - Город — выпадающий список
  - Категория — чипы (Все / Барбершоп / Nail-студия / ...)
- Сетка карточек бизнесов (12 на страницу): лого, название, категория, город, средний рейтинг, количество отзывов, кнопка "Записаться"
- Пагинация снизу
- Empty state: "В вашем городе пока нет бизнесов. Попробуйте другой город"

### 11.3 Страница бизнеса `/businesses/[slug]`
- Шапка: лого, название, категория, адрес, телефон, средний рейтинг
- Вкладки: **Мастера** | **Услуги** | **Отзывы**
- **Вкладка Мастера:** карточки мастеров (фото, имя, специализация, услуги, иконка ❤ в избранное, кнопка "Записаться")
- **Вкладка Услуги:** таблица услуг (название, описание, длительность, цена)
- **Вкладка Отзывы:** список отзывов (аватар клиента, имя, рейтинг, комментарий, дата), средний рейтинг сверху

### 11.4 Форма записи `/businesses/[slug]/book`
Многошаговая форма (stepper сверху показывает прогресс):
- **Шаг 1 / Мастер** — если не выбран заранее, показывается список мастеров
- **Шаг 2 / Услуги** — чекбоксы с услугами выбранного мастера, итог: цена + длительность
- **Шаг 3 / Дата** — календарь, недоступны: прошлые дни, выходные мастера, дни дальше maxAdvanceBookingDays
- **Шаг 4 / Время** — кнопки-слоты по 30 минут, недоступные слоты задизейблены
- **Шаг 5 / Подтверждение** — итоговая карточка + поле "Примечания" + кнопка "Подтвердить"
- Кнопка "Назад" на каждом шаге

### 11.5 Дашборд клиента `/dashboard`
- Приветствие: "Привет, {имя}!"
- Блок "Ближайшая запись" — карточка с мастером, услугой, датой, кнопкой "Отменить"
- Блок "Предстоящие записи" — список до 3 записей, ссылка "Все записи"
- Блок "Избранные мастера" — горизонтальный скролл, ссылка "Все избранные"
- Блок "Популярное в {город}" — 4 карточки бизнесов из города клиента, отсортированных по рейтингу. Если город не указан — блок не показывается

### 11.6 Список записей клиента `/bookings`
- Фильтр по статусу: Все | Предстоящие | Завершённые | Отменённые
- Карточки записей: мастер, услуги, дата/время, статус (бейдж), цена
- Пагинация (10 на страницу)
- Empty state по каждому фильтру

---

## 12. Индексы базы данных

```prisma
@@index([businessId])           // Staff, Service, Booking
@@index([clientId])             // Booking, Review, Favorite
@@index([staffId])              // Booking, Schedule, Favorite
@@index([status])               // Booking
@@index([date])                 // Booking
@@index([slug])                 // Business (уже unique = автоиндекс)
@@index([category])             // Business
@@index([isActive, isVisible])  // Business (составной для каталога)
```

---

## 13. Seed-данные

Скрипт `prisma/seed.ts` должен создавать:

| Что | Количество |
|---|---|
| SUPER_ADMIN | 1 (email: admin@liora.app) |
| Бизнесы с BUSINESS_ADMIN | 3 (барбершоп, nail-студия, массаж) |
| Мастера на каждый бизнес | 2–3 |
| Услуги на каждый бизнес | 3–5 |
| Расписание для каждого мастера | Пн–Пт 09:00–18:00 |
| CLIENT-пользователи | 5 |
| Записи (разные статусы) | 10–15 |
| Отзывы | 5–8 |

---

- Пароли хешируются `bcryptjs` (saltRounds = 12)
- JWT хранится в httpOnly cookie
- Все приватные маршруты защищены `JwtAuthGuard`
- Доступ к ресурсам проверяется по `businessId` (изоляция тенантов)
- CORS настроен на конкретный origin фронтенда
- Валидация входных данных через `class-validator` + Zod на фронтенде

---

## 14. Требования к безопасности

- Пароли хешируются `bcryptjs` (saltRounds = 12)
- JWT хранится в httpOnly cookie
- Все приватные маршруты защищены `JwtAuthGuard`
- Доступ к ресурсам проверяется по `businessId` (изоляция тенантов)
- BUSINESS_ADMIN не может редактировать данные мастеров из чужого бизнеса
- STAFF не может редактировать собственный профиль — только BUSINESS_ADMIN
- CORS настроен на конкретный origin фронтенда
- Валидация входных данных через `class-validator` + Zod на фронтенде

---

## 15. Схема авторизации

### 15.1 Регистрация (email + пароль)

```
[Frontend /auth/register]
        │
        │ POST /api/auth/register { name, email, password }
        ▼
[NestJS AuthController]
        │
        │ bcrypt.hash(password) → создаёт User (role: CLIENT)
        │ возвращает { user, accessToken }
        ▼
[NextAuth] signIn("credentials") → сохраняет в сессию
        │
        ▼
Редирект на /dashboard
```

### 15.2 Вход (email + пароль)

```
[Frontend /auth/login]
        │
        │ NextAuth signIn("credentials", { email, password })
        ▼
[NextAuth Credentials Provider]
        │
        │ POST /api/auth/login { email, password }
        ▼
[NestJS] passport-local стратегия
        │ проверяет email → bcrypt.compare(password)
        │ возвращает { user: { id, name, email, role }, accessToken }
        ▼
[NextAuth] сохраняет в JWT-сессию:
        { user: { id, name, email, role }, accessToken }
        │
        ▼
Редирект по роли: CLIENT→/dashboard, STAFF→/staff/dashboard,
                  BUSINESS_ADMIN→/manage, SUPER_ADMIN→/admin
```

### 15.3 Вход через Google (OAuth)

```
[Frontend] кнопка "Войти через Google"
        │
        │ NextAuth signIn("google")
        ▼
[Google OAuth] пользователь разрешает доступ
        │
        │ возвращает { googleId, email, name, picture }
        ▼
[NextAuth Google Provider callback]
        │
        │ POST /api/auth/google { googleId, email, name, avatarUrl }
        ▼
[NestJS] ищет User по email
        │ если нет → создаёт User (role: CLIENT, passwordHash: null)
        │ если есть → возвращает существующего
        │ возвращает { user, accessToken }
        ▼
[NextAuth] сохраняет в сессию, редирект на /dashboard
```

### 15.4 Защита маршрутов в Next.js

```typescript
// middleware.ts (Next.js)
// Защищает все маршруты кроме публичных
// Использует NextAuth auth() для проверки сессии

Публичные маршруты (без проверки):
  /, /auth/login, /auth/register, /businesses/*, /api/*

Защищённые маршруты (редирект на /auth/login если нет сессии):
  /dashboard, /bookings/*, /profile/*, /favorites,
  /staff/*, /manage/*, /admin/*

Роле-защищённые (редирект на /dashboard если не та роль):
  /staff/*    → только STAFF
  /manage/*   → только BUSINESS_ADMIN
  /admin/*    → только SUPER_ADMIN
```

### 15.5 Вызовы NestJS API с фронтенда

```typescript
// Каждый запрос к защищённым эндпоинтам NestJS
// отправляет accessToken из NextAuth сессии в заголовке

Authorization: Bearer <accessToken из NextAuth session>

// NestJS JwtAuthGuard валидирует токен через passport-jwt
// Извлекает userId и role из payload токена
```

### 15.6 Время жизни токенов

| Токен | Время жизни | Где хранится |
|---|---|---|
| NestJS accessToken (JWT) | 7 дней | В NextAuth сессии (httpOnly cookie) |
| NextAuth сессия | 7 дней | httpOnly cookie (`next-auth.session-token`) |
| Google OAuth токен | Не хранится | Используется только в момент входа |

### 15.7 Дополнительные переменные окружения для авторизации

Frontend `.env.local`:
```
NEXTAUTH_SECRET=           # минимум 32 символа
NEXTAUTH_URL=              # https://liora.vercel.app
GOOGLE_CLIENT_ID=          # из Google Cloud Console
GOOGLE_CLIENT_SECRET=      # из Google Cloud Console
```

---

## 16. Переменные окружения

### Backend (.env)
```
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
PORT=3001
CORS_ORIGIN=https://liora.vercel.app
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://liora-api.railway.app
```

---

## 17. Swagger / OpenAPI

### 17.1 Настройка (NestJS main.ts)

```typescript
const config = new DocumentBuilder()
  .setTitle('Liora API')
  .setDescription('REST API для платформы онлайн-записи Liora')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

Swagger UI доступен по адресу: `https://liora-api.railway.app/api/docs`

### 17.2 Обязательные декораторы

Каждый контроллер:
```typescript
@ApiTags('bookings')                    // группировка в Swagger UI
@ApiBearerAuth()                        // на защищённых контроллерах
@Controller('bookings')
```

Каждый эндпоинт:
```typescript
@ApiOperation({ summary: 'Создать запись' })
@ApiResponse({ status: 201, description: 'Запись создана', type: BookingDto })
@ApiResponse({ status: 400, description: 'Ошибка валидации' })
@ApiResponse({ status: 401, description: 'Не авторизован' })
@ApiResponse({ status: 409, description: 'Время уже занято' })
```

POST/PATCH эндпоинты:
```typescript
@ApiBody({ type: CreateBookingDto })    // схема с примерами значений
```

### 17.3 Минимальный перечень задокументированных эндпоинтов

| Эндпоинт | Тег | Auth |
|---|---|---|
| POST /api/auth/register | auth | — |
| POST /api/auth/login | auth | — |
| GET /api/businesses | businesses | — |
| POST /api/businesses | businesses | Bearer |
| GET /api/businesses/:slug | businesses | — |
| GET /api/businesses/:id/staff | staff | — |
| POST /api/businesses/:id/staff | staff | Bearer |
| GET /api/staff/:id/available-slots | staff | — |
| GET /api/bookings | bookings | Bearer |
| POST /api/bookings | bookings | Bearer |
| GET /api/bookings/:id | bookings | Bearer |
| PATCH /api/bookings/:id/status | bookings | Bearer |
| DELETE /api/bookings/:id | bookings | Bearer |

---

## 18. Структура проекта

### Frontend — `/frontend`

```
/app
  /(auth)
    /login          page.tsx
    /register       page.tsx
  /(protected)
    /dashboard      page.tsx
    /bookings
      /[id]         page.tsx
      page.tsx
    /profile
      /edit         page.tsx
      /password     page.tsx
    /favorites      page.tsx
  /(staff)
    /staff
      /dashboard    page.tsx
      /bookings     page.tsx
      /schedule     page.tsx
  /(business)
    /manage
      /staff        page.tsx
      /services     page.tsx
      /bookings     page.tsx
      /settings     page.tsx
      page.tsx
  /(admin)
    /admin
      /businesses   page.tsx
      /users        page.tsx
      page.tsx
  /businesses
    /[slug]
      /book         page.tsx
      page.tsx
    page.tsx
  /not-found        page.tsx
  layout.tsx
  page.tsx          (лендинг)

/components
  /ui               shadcn/ui компоненты
  /layout           Header, Footer
  /bookings         BookingCard, BookingStatus
  /businesses       BusinessCard, BusinessHeader
  /staff            StaffCard
  /forms            BookingForm, ProfileForm и др.
  /shared           Skeleton, EmptyState, ErrorBoundary

/lib
  /api.ts           axios instance с interceptors (прокидывает Bearer токен)
  /auth.ts          NextAuth config (providers, callbacks)
  /utils.ts         вспомогательные функции
  /constants.ts     списки стран и городов

/types
  index.ts          все TypeScript интерфейсы и типы

middleware.ts       защита роутов (NextAuth)
/.env.local         (в .gitignore)
/.env.example
```

### Backend — `/backend`

```
/src
  /main.ts          bootstrap, Swagger setup, CORS, ValidationPipe
  /app.module.ts    корневой модуль

  /auth
    auth.module.ts
    auth.controller.ts
    auth.service.ts
    /strategies
      local.strategy.ts   (passport-local)
      jwt.strategy.ts     (passport-jwt)
    /guards
      jwt-auth.guard.ts
      roles.guard.ts
    /decorators
      roles.decorator.ts
      current-user.decorator.ts
    /dto
      register.dto.ts
      login.dto.ts

  /users
    users.module.ts
    users.controller.ts
    users.service.ts
    /dto

  /businesses
    businesses.module.ts
    businesses.controller.ts
    businesses.service.ts
    /dto

  /staff
    staff.module.ts
    staff.controller.ts
    staff.service.ts
    /dto

  /services
    services.module.ts
    services.controller.ts
    services.service.ts
    /dto

  /bookings
    bookings.module.ts
    bookings.controller.ts
    bookings.service.ts
    /dto

  /reviews
    reviews.module.ts
    reviews.controller.ts
    reviews.service.ts
    /dto

  /upload
    upload.module.ts
    upload.service.ts   (Cloudinary)

  /prisma
    prisma.module.ts
    prisma.service.ts

/prisma
  schema.prisma
  /migrations
  seed.ts

/.env               (в .gitignore)
/.env.example
```

---

## 19. Состояния загрузки и обработка ошибок

### 19.1 Состояния загрузки

Каждая страница с асинхронными данными использует один из подходов:

| Тип данных | Реализация |
|---|---|
| Список карточек (каталог, записи) | Skeleton-карточки (shadcn/ui `Skeleton`) |
| Детальная страница | Skeleton полной страницы |
| Кнопка при отправке формы | `disabled` + spinner внутри кнопки |
| Inline-данные (рейтинг, счётчики) | Skeleton-строка |

Пример в Next.js App Router: файл `loading.tsx` рядом с `page.tsx` автоматически показывается во время загрузки Server Component.

### 19.2 Error Boundary

Компонент `/components/shared/ErrorBoundary.tsx` оборачивает критические блоки:
- Форму записи
- Список мастеров на странице бизнеса
- Дашборд

При ошибке показывает: "Что-то пошло не так. Попробуйте обновить страницу" + кнопка "Обновить".

В Next.js App Router: файл `error.tsx` рядом с `page.tsx` автоматически является Error Boundary для этого сегмента.

### 19.3 Глобальный обработчик ошибок API

`/lib/api.ts` — axios instance с response interceptor:
```typescript
// 401 → редирект на /auth/login
// 403 → toast "Нет доступа"
// 500 → toast "Ошибка сервера. Попробуйте позже"
// network error → toast "Нет подключения к серверу"
```

---

## 20. Стандарты кода

### 20.1 TypeScript
- `"strict": true` в `tsconfig.json` обоих проектов
- Минимум 80% покрытия типами
- Запрещены `any` без явного обоснования
- Все DTO, интерфейсы и типы описаны явно

### 20.2 ESLint
- Backend: `@nestjs/eslint-config`
- Frontend: `next/core-web-vitals`
- Перед сдачей: `npx eslint . --max-warnings 0` проходит без ошибок

### 20.3 Именование

| Что | Стиль | Пример |
|---|---|---|
| React компоненты | PascalCase | `BookingCard.tsx` |
| Файлы компонентов | kebab-case | `booking-card.tsx` |
| Функции, переменные | camelCase | `getAvailableSlots` |
| Константы | UPPER_SNAKE_CASE | `MAX_ADVANCE_DAYS` |
| NestJS сервисы/контроллеры | PascalCase | `BookingsService` |
| Prisma модели | PascalCase | `Booking`, `StaffService` |
| API маршруты | kebab-case | `/api/available-slots` |

### 20.4 Запреты
- Нет `console.log` в продакшн-коде (только `console.error` для логирования ошибок)
- Нет закомментированного кода в финальной версии
- Нет хардкода URL, секретов, токенов — только через `.env`

### 20.5 README.md (обязательно для обоих репозиториев)

Содержит:
- Описание проекта и его назначение
- Скриншоты ключевых экранов
- Технологии
- Инструкция по локальному запуску (`npm install`, настройка `.env`, `prisma migrate dev`, `npm run dev`)
- Ссылка на live-demo
- Раздел "AI-инструменты" — как использовались в разработке

---

## 21. Дизайн-система

### 21.1 Стиль

**Характер:** минималистичный, элегантный, премиальный. Много воздуха, чистые линии, фиолетовая палитра как основа бренда. Подходит одновременно для nail-студий, барбершопов и других сервисных бизнесов.

---

### 21.2 Цветовая палитра

```css
/* Основные */
--color-primary-900: #1E1145;   /* тёмно-фиолетовый — активные элементы, выбранные состояния */
--color-primary-700: #3D2A8A;   /* фиолетовый — кнопки primary, активный шаг stepper */
--color-primary-500: #7B5EA7;   /* средний фиолетовый — иконки stepper, акценты */
--color-primary-200: #C9BCEB;   /* светло-фиолетовый — hover states, borders */
--color-primary-100: #EDE8F8;   /* лавандовый — фон sidebar "Ваша запись", disabled слоты */
--color-primary-50:  #F7F4FD;   /* почти белый с фиолетовым оттенком — фон страницы */

/* Нейтральные */
--color-neutral-900: #1A1A2E;   /* основной текст */
--color-neutral-500: #6B6B8A;   /* вторичный текст (метки, подписи) */
--color-neutral-300: #C4C4D4;   /* разделители, borders неактивных элементов */
--color-neutral-100: #F4F4F8;   /* фон карточек, неактивные слоты */

/* Семантические */
--color-success: #4CAF82;       /* CONFIRMED статус */
--color-warning: #F59E0B;       /* PENDING статус */
--color-error:   #EF4444;       /* ошибки, CANCELLED статус */
--color-white:   #FFFFFF;
```

---

### 21.3 Типографика

```css
/* Шрифты — Google Fonts */
--font-brand: 'Cormorant Garamond', serif;   /* логотип LIORA */
--font-ui:    'Inter', sans-serif;           /* весь UI текст */

/* Размеры */
--text-xs:   12px / line-height: 16px;
--text-sm:   14px / line-height: 20px;
--text-base: 16px / line-height: 24px;
--text-lg:   18px / line-height: 28px;
--text-xl:   20px / line-height: 30px;
--text-2xl:  24px / line-height: 32px;
--text-3xl:  30px / line-height: 40px;

/* Веса */
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

---

### 21.4 Tailwind config

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: {
        50:  '#F7F4FD',
        100: '#EDE8F8',
        200: '#C9BCEB',
        500: '#7B5EA7',
        700: '#3D2A8A',
        900: '#1E1145',
      },
      neutral: {
        100: '#F4F4F8',
        300: '#C4C4D4',
        500: '#6B6B8A',
        900: '#1A1A2E',
      }
    },
    fontFamily: {
      brand: ['Cormorant Garamond', 'serif'],
      ui:    ['Inter', 'sans-serif'],
    },
    borderRadius: {
      DEFAULT: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
    boxShadow: {
      card: '0 2px 12px rgba(61, 42, 138, 0.08)',
      dropdown: '0 8px 24px rgba(61, 42, 138, 0.12)',
    }
  }
}
```

---

### 21.5 Компонентные стили

#### Кнопки
```
Primary:   bg-primary-700, text-white, hover:bg-primary-900, rounded-lg, px-6 py-3
Secondary: bg-primary-100, text-primary-700, hover:bg-primary-200, rounded-lg
Ghost:     bg-transparent, text-primary-700, hover:bg-primary-50
Danger:    bg-error, text-white
Disabled:  bg-neutral-100, text-neutral-300, cursor-not-allowed
```

#### Слоты времени (из референса)
```
Available:    bg-white, border border-neutral-300, text-neutral-900, hover:border-primary-500
Selected:     bg-white, border-2 border-primary-700, text-primary-700, font-semibold
Unavailable:  bg-neutral-100, text-neutral-300, line-through, cursor-not-allowed
```

#### Дни в календаре
```
Default:  bg-white, border border-neutral-300, rounded-lg
Selected: bg-primary-900, text-white, rounded-lg
Today:    border-primary-500, text-primary-700
Disabled: bg-neutral-100, text-neutral-300
```

#### Stepper (шаги формы)
```
Пройденный шаг:  circle bg-primary-500, text-white + label text-primary-500
Активный шаг:    circle bg-primary-900, text-white + label text-primary-900 font-semibold
Будущий шаг:     circle border border-neutral-300, text-neutral-300 + label text-neutral-300
Линия между:     border-t border-neutral-300 (пройденные — border-primary-500)
```

#### Sidebar "Ваша запись"
```
bg-primary-100, rounded-xl, p-6
Метки:    text-neutral-500, text-sm, uppercase, letter-spacing
Значения: text-neutral-900, text-right
Итого:    text-primary-900, font-bold, text-lg
```

#### Карточки
```
bg-white, rounded-xl, shadow-card, p-6
Hover:  shadow-dropdown, translateY(-2px), transition-all
```

#### Badges статусов
```
PENDING:   bg-warning/10,  text-warning,  "Ожидает"
CONFIRMED: bg-success/10,  text-success,  "Подтверждена"
CANCELLED: bg-error/10,    text-error,    "Отменена"
COMPLETED: bg-primary-100, text-primary-700, "Завершена"
```

---

### 21.6 Логотип и хедер

Из референса:
```
LIORA               ← font-brand, font-bold, text-xl, letter-spacing-widest, text-primary-900
Blossom Nail Studio ← font-ui, text-sm, text-primary-500
```

В нашей платформе хедер бизнеса:
```
LIORA               ← бренд платформы (всегда)
{Название бизнеса}  ← подпись под логотипом на страницах бизнеса
```

---

### 21.7 Адаптивность

| Брейкпоинт | Размер | Изменения |
|---|---|---|
| `sm` | 375px+ | Мобильный: одна колонка, слоты 2 в ряд |
| `md` | 768px+ | Планшет: stepper компактный, слоты 3 в ряд |
| `lg` | 1024px+ | Десктоп: двухколоночный layout (форма + sidebar) |
| `xl` | 1280px+ | Широкий: max-width 1200px, центрирование |

---

## 23. Дополнительные фичи (после MVP)

- SMS / email напоминания за 24 часа до записи
- Онлайн-оплата (Stripe / ЮKassa)
- Виджет записи для вставки на сторонний сайт
- Мобильное приложение (React Native)
- Аналитика для бизнеса (выручка, популярные услуги)
- Тарифные планы (freemium → подписка)

---

## 24. MVP scope (для сдачи проекта)

Обязательно реализовать:
- [ ] Регистрация / вход / выход (все роли)
- [ ] Создание бизнеса + мастера + услуги (BUSINESS_ADMIN)
- [ ] Публичный каталог бизнесов с поиском
- [ ] Страница бизнеса с мастерами и услугами
- [ ] Форма записи с выбором слотов
- [ ] Список и детали записи (CLIENT)
- [ ] Управление записями (STAFF, BUSINESS_ADMIN)
- [ ] Панель SUPER_ADMIN
- [ ] Swagger документация
- [ ] Деплой на Vercel + Railway
