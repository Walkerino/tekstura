# Tekstura

Сайт дизайн-агентства с публичным лендингом, страницей кейсов и админ-панелью для управления контентом.

Проект состоит из двух частей в одном репозитории:
- `frontend`: React + Vite приложение (публичный сайт + UI админки).
- `backend`: Fastify API + SQLite (через Prisma) для контента, форм и авторизации администратора.

## Что реализовано
- Публичная часть:
  - лендинг с секциями услуг, кейсов, отзывов, новостей, контактов;
  - страница детального просмотра кейса `/cases/:slug`;
  - страницы `/privacy-policy` и `/public-offer`.
- Админка:
  - вход по cookie-based JWT сессии;
  - CRUD для кейсов, новостей и отзывов;
  - загрузка изображений в папку `uploads/`;
  - дашборд со счетчиками контента и заявок.
- Формы:
  - заявка на аудит `/api/forms/audit`;
  - контактная форма `/api/forms/contact`;
  - email-уведомление основателю о новой заявке на аудит;
  - basic anti-spam через honeypot поле `website`.

## Технологический стек
- Frontend: `React 18`, `TypeScript`, `React Router`, `Vite`.
- UI/Styles: обычные CSS-файлы + `Tailwind CSS` utility-классы (в основном в админке), Radix primitives.
- Backend: `Fastify`, `@fastify/jwt`, `@fastify/cookie`, `@fastify/multipart`, `@fastify/rate-limit`, `@fastify/static`.
- DB: `SQLite` + `Prisma`.
- Инструменты: `tsx`, `concurrently`, `eslint`.

## Архитектура

### 1) Frontend архитектура

Маршрутизация описана в `src/App.tsx` и разделена на 2 области:
- публичная: `/`, `/cases/:slug`, `/privacy-policy`, `/public-offer`;
- административная: `/admin/*`.

Ключевые принципы:
- Слой API-клиента: `src/lib/api.ts`.
  - Вся коммуникация с backend централизована;
  - единый обработчик ошибок (`ApiError`), единые `fetch`-настройки.
- Слой страниц: `src/pages/*` и `src/pages/admin/*`.
  - Страницы отвечают за orchestration состояния/загрузки;
  - визуальные блоки вынесены в `src/components/*`.
- Слой типов: `src/types/content.ts`.
  - Общие типы DTO для публичной части и админки.
- Доступ в админку:
  - `RequireAdmin` делает проверку сессии через `/api/admin/session`;
  - неавторизованные пользователи редиректятся на `/admin/login`.

Поток данных на клиенте:
1. Компонент страницы вызывает функцию из `src/lib/api.ts`.
2. API-клиент отправляет запрос на `/api/...`.
3. Ответ валидируется на уровне статуса/формата и возвращается странице.
4. Страница обновляет state и рендерит UI.

### 2) Backend архитектура

Точка входа: `server/index.ts`.

Состав backend:
- инициализация БД (`ensureDatabase`) через `prisma/init.sql`;
- регистрация плагинов Fastify (cookie, jwt, multipart, rate-limit, static);
- регистрация роутов:
  - `server/routes/public.ts`
  - `server/routes/admin.ts`
  - `server/routes/upload.ts`
- глобальный `notFound` и `error` handler.

Слои backend:
- `server/routes/*`: transport-слой (HTTP, коды ответов, parse request).
- `server/lib/auth.ts`: авторизация/сессии администратора.
- `server/lib/prisma.ts`: singleton PrismaClient.
- `server/lib/slug.ts`: slugify + генерация уникальных slug.
- `server/lib/content.ts`: утилиты контента (excerpt).

Авторизация:
- Логин: `/api/admin/auth/login`.
- JWT хранится в `httpOnly` cookie `tekstura_admin_token`.
- Защищенные роуты используют `requireAdmin(...)`.
- При старте всегда выполняется `ensureDefaultAdmin()`:
  - если admin уже есть, его пароль обновляется из `ADMIN_PASSWORD`.

### 3) База данных

Схема описана в `prisma/schema.prisma`.

Основные сущности:
- `AdminUser` — администратор.
- `CaseItem` + `CaseImage` — кейсы и галерея.
- `ReviewItem` — отзывы.
- `NewsPost` — новости.
- `AuditRequest` и `ContactRequest` — входящие заявки.

Особенности:
- Публичные API отдают только `isPublished = true`.
- В текущей реализации админка при создании/обновлении контента выставляет `isPublished: true`.
- Связь `CaseItem -> CaseImage` с `ON DELETE CASCADE`.

## Карта API

### Public API
- `GET /api/health`
- `GET /api/cases`
- `GET /api/cases/:slug`
- `GET /api/reviews`
- `GET /api/news`
- `GET /api/news/:slug`
- `POST /api/forms/audit` (rate limit: 5 запросов/мин)
- `POST /api/forms/contact` (rate limit: 5 запросов/мин)

### Admin API
- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `GET /api/admin/session`
- `GET /api/admin/overview`
- `GET/POST/PATCH/DELETE /api/admin/cases...`
- `GET/POST/PATCH/DELETE /api/admin/news...`
- `GET/POST/PATCH/DELETE /api/admin/reviews...`
- `POST /api/admin/upload`

## Структура проекта

```text
.
├── prisma/
│   ├── schema.prisma      # Prisma schema
│   ├── init.sql           # SQL-инициализация SQLite
│   └── seed.ts            # сиды
├── public/
│   └── assets/            # статические изображения/иконки
├── server/
│   ├── index.ts           # запуск Fastify + плагины + роуты
│   ├── env.ts             # env defaults + валидация через zod
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── content.ts
│   │   ├── prisma.ts
│   │   └── slug.ts
│   └── routes/
│       ├── admin.ts
│       ├── public.ts
│       └── upload.ts
├── src/
│   ├── App.tsx            # роутинг приложения
│   ├── index.css          # глобальные стили
│   ├── components/
│   │   ├── admin/         # блоки админки
│   │   └── ui/            # UI primitives
│   ├── data/              # навигация и тексты юридических страниц
│   ├── lib/               # api client, utils, formatters
│   ├── pages/
│   │   ├── admin/         # страницы админки
│   │   └── *.tsx          # публичные страницы
│   └── types/
│       └── content.ts
├── uploads/               # пользовательские загрузки
└── vite.config.ts         # proxy /api и /uploads
```

## Быстрый старт

### Требования
- Node.js 20+
- npm 10+
- `sqlite3` CLI в системе (нужен для `db:push` и автоинициализации)

### Установка и запуск

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

После старта:
- Frontend (Vite): `http://localhost:5173`
- Backend (Fastify): `http://localhost:3001`

Админка: `http://localhost:5173/admin/login`

По умолчанию:
- email: `admin@tekstura.ru`
- пароль: `ChangeMe123!`

## Переменные окружения

Файл: `.env`

- `DATABASE_URL` — путь до SQLite БД (формат: `file:./dev.db`).
- `JWT_SECRET` — секрет подписи JWT (минимум 12 символов).
- `ADMIN_EMAIL` — логин администратора по умолчанию.
- `ADMIN_PASSWORD` — пароль администратора по умолчанию.
- `PORT` — порт backend (по умолчанию `3001`).
- `UPLOAD_DIR` — директория для загруженных файлов (по умолчанию `uploads`).
- `AUDIT_NOTIFICATION_EMAIL` — почта получателя заявок на аудит (например, `kleynovino@mail.ru`).
- `SMTP_HOST` — SMTP-хост для отправки уведомлений (например, `smtp.mail.ru`).
- `SMTP_PORT` — SMTP-порт (обычно `465` для SSL).
- `SMTP_SECURE` — использовать защищенное SMTP-соединение (`true`/`false`).
- `SMTP_USER` — логин SMTP.
- `SMTP_PASSWORD` — пароль приложения/SMTP.
- `SMTP_FROM` — адрес отправителя (опционально; если пусто, используется `SMTP_USER`).

## Скрипты npm

- `npm run dev` — одновременно web + api (через `concurrently`).
- `npm run dev:web` — только Vite.
- `npm run dev:api` — только Fastify API.
- `npm run build` — сборка frontend + typecheck server.
- `npm run start` — production запуск server (`NODE_ENV=production`).
- `npm run preview` — build + start.
- `npm run lint` — eslint.
- `npm run db:push` — применить `prisma/init.sql` в SQLite.
- `npm run db:seed` — заполнить базу стартовыми данными.
- `npm run db:reset` — пересоздать БД и пересидировать.

## Продакшен-сценарий

1. Собрать фронт:
```bash
npm run build
```
2. Запустить backend:
```bash
npm run start
```

Что происходит:
- Fastify раздает `dist/` как статический frontend;
- API доступно по `/api/*`;
- загруженные изображения раздаются по `/uploads/*`.

## Автодеплой из `main` (GitHub Actions)

В репозитории добавлен workflow: `.github/workflows/deploy-main.yml`.

Логика:
1. На каждый push в ветку `main` запускается job `build`.
2. Если `build` успешен, запускается job `deploy`.
3. `deploy` копирует проект на сервер в `/opt/tekstura` по SSH.
4. На сервере запускается `scripts/deploy.sh`, который:
   - ставит зависимости (`npm ci`);
   - собирает проект (`npm run build`);
   - применяет SQL-инициализацию БД (`npm run db:push`), если есть `sqlite3`;
   - перезапускает `systemd`-сервис `tekstura.service`.

### Что нужно добавить в GitHub Secrets

В `Settings -> Secrets and variables -> Actions`:
- `DEPLOY_HOST` (например, `212.22.82.209`)
- `DEPLOY_PORT` (обычно `22`)
- `DEPLOY_USER` (например, `root`)
- `DEPLOY_PASSWORD` (SSH пароль пользователя)

### Требования на сервере
- Папка проекта: `/opt/tekstura`
- Установлены: `node` (20+), `npm`, `sqlite3`, `systemd`
- Продакшен `.env` лежит на сервере в `/opt/tekstura/.env` (workflow его не затирает)

## Важные заметки
- Страница `src/pages/NewsDetailPage.tsx` сейчас не подключена к роутеру в `App.tsx`.
- Для production обязательно задайте сильный `JWT_SECRET` и смените дефолтные admin credentials.

## Что можно улучшить дальше
- Добавить нормальные миграции Prisma (`prisma migrate`) вместо SQL bootstrap.
- Добавить роли/нескольких администраторов и аудит действий.
- Добавить тесты: API integration (Fastify) и component tests (React).
- Подключить object storage (S3/MinIO) вместо хранения файлов в `uploads/`.
