# LMAJHOL Deploy Checklist

## 1) Local test

```bash
npm install
npm run dev
```

## 2) Add environment variables in Netlify

Required:
- `ADMIN_PASSWORD`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Recommended for live admin CRUD + saved orders:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 3) Supabase setup

- Create a free Supabase project
- Open SQL Editor
- Run `supabase/schema.sql`

## 4) Deploy

- Push project to GitHub
- Import repo into Netlify
- Build command: `npm run build`
- Node version: `20`

## 5) Routes

- Storefront: `/`
- Admin login: `/admin/login`
- Admin dashboard: `/admin`

## 6) What works immediately

- 3D premium storefront
- Scroll-driven hero motion
- Product catalog UI
- Order modal UI
- Telegram order route once env vars are set
- Admin login gate once `ADMIN_PASSWORD` is set

## 7) What needs Supabase to be fully live

- Persistent add/edit/delete product actions
- Order history saved in database
