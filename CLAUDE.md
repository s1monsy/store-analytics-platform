# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # встановити залежності
npm run dev        # запустити dev-сервер (http://localhost:3000)
npm run build      # production build
npm run lint       # ESLint перевірка
```

Проєкт не має тестів.

## Architecture

Next.js 16 App Router дашборд для торгової точки. Повністю клієнтський — без бекенду, бази даних або API-роутів. Всі дані мокові та живуть у пам'яті браузера.

### Data flow

`lib/store.ts` — singleton-модуль з моковими даними (продажі за 30 днів, товари інвентарю). Генерує дані при першому виклику і зберігає їх у модульних змінних між навігаціями.

`lib/store-context.tsx` — React Context (`StoreProvider` / `useStore`) що обгортає дані зі `store.ts` і надає CRUD-операції компонентам. Провайдер підключений у `app/(dashboard)/layout.tsx` — тобто доступний тільки в авторизованій зоні.

### Routing

```
/               → redirect на /login
/login          → сторінка входу (будь-які дані приймаються)
/dashboard      → головний дашборд з графіками і статистикою
/sales          → таблиця продажів, форма додавання/редагування
/inventory      → таблиця інвентарю, форма додавання/коригування
/reports        → звіти (фільтри по датах, експорт)
```

Маршрути `/dashboard`, `/sales`, `/inventory`, `/reports` — у route group `(dashboard)`, яка підключає `AppSidebar` і `StoreProvider`.

### UI

- Компоненти з `shadcn/ui` знаходяться в `components/ui/` — їх не треба редагувати напряму
- Кастомні компоненти: `components/app-sidebar.tsx`, `components/top-bar.tsx`, `components/stats-card.tsx`, `components/daily-sales-chart.tsx`, `components/category-pie-chart.tsx`, `components/recent-activity-table.tsx`, `components/sale-form-modal.tsx`, `components/inventory-form-modal.tsx`
- Графіки — Recharts через обгортку `components/ui/chart.tsx`
- Теми — `next-themes`, підключено в `app/layout.tsx`
- Шрифт — Inter з підтримкою кирилиці (`--font-inter`)

### Key constraints

- `react-day-picker` v9 (не v8) — API `classNames` і `components` відрізняється від старих прикладів shadcn
- `date-fns` v3 (не v4) — через обмеження `react-day-picker`
- `typescript.ignoreBuildErrors: true` у `next.config.mjs` — TS помилки не блокують build
- Дані не зберігаються між перезавантаженнями сторінки

## Thesis context

Файл `docs/thesis-context.md` — це живий документ для дипломної роботи. Після кожної значущої зміни в проєкті (нова технологія, архітектурне рішення, підключення Supabase, написання тестів тощо) — додавати запис у розділ **Журнал рішень** з датою, описом що зроблено і чому саме так.

## Conventions

- Відповідати українською мовою
- Мінімальний diff — питати перед великими або архітектурними змінами
- Не вигадувати API бібліотек — перевіряти в коді або документації
