# TradePoint Data

Веб-застосунок для управління торговою точкою — облік продажів, інвентар складу, аналітика та звіти.

## Стек

- **Next.js 16** (App Router) — фреймворк
- **React 19** + **TypeScript** — UI та типізація
- **Tailwind CSS v3** + **shadcn/ui** — стилізація та компоненти
- **Supabase** — база даних (PostgreSQL), авторизація, файлове сховище
- **Recharts** — графіки
- **date-fns v3** — робота з датами

## Функціонал

- Авторизація (логін, логаут, скидання пароля через email)
- Дашборд з KPI, графіками продажів та останньою активністю
- Облік продажів — CRUD, фільтрація, пагінація
- Управління складом — CRUD, коригування кількості, сповіщення про низький залишок
- Звіти з фільтрацією по датах та експортом у CSV
- Профіль користувача з завантаженням аватара та зміною пароля
- Налаштування магазину (назва, адреса, валюта, часовий пояс)
- Реальний курс валют з API Монобанку
- Підтримка світлої та темної теми

## Структура проєкту

```
app/
  (dashboard)/          # Захищені сторінки (layout з sidebar)
    dashboard/
    sales/
    inventory/
    reports/
    profile/
    settings/
  login/                # Сторінка входу
  reset-password/       # Скидання пароля
shared/
  components/           # UI та layout компоненти
  hooks/                # Кастомні React хуки
  lib/                  # Supabase клієнт, store context, db запити
  types/                # TypeScript інтерфейси
  constants/            # Константи (валюти, часові пояси)
  utils/                # Утилітарні функції
```

## Запуск

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run lint
```

## Змінні середовища

Створи файл `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## База даних (Supabase)

Таблиці:

```sql
-- Продажі
CREATE TABLE sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  shift text NOT NULL,
  payment_type text NOT NULL,
  total_amount numeric NOT NULL,
  receipts_count integer NOT NULL,
  returns_amount numeric NOT NULL DEFAULT 0,
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Інвентар
CREATE TABLE inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text NOT NULL,
  qty integer NOT NULL DEFAULT 0,
  min_qty integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Налаштування магазину
CREATE TABLE store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  currency text NOT NULL DEFAULT 'UAH',
  timezone text NOT NULL DEFAULT 'Europe/Kyiv',
  updated_at timestamptz DEFAULT now()
);
```

Row Level Security увімкнено на всіх таблицях.
