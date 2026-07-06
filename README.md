# LMAJHOL — premium 3D storefront

A modern monochrome fashion storefront for **LMAJHOL**, built for a Moroccan cash-on-delivery workflow.

## Stack

- **Next.js 14 + TypeScript + Tailwind**
- **React Three Fiber + Drei** for the 3D hero scene
- **GSAP ScrollTrigger** for scroll-driven motion
- **Telegram bot integration** for orders
- **Supabase** for optional live product management + order storage
- **Admin dashboard** protected with a server-side password cookie

## Features

- Premium black/white **gallery-style brand direction**
- Full-screen **3D opening scene** with scroll animation
- Editable product catalog with seeded products:
  - White Oversized Tee
  - Black Oversized Tee
- Cash-on-delivery checkout form in French
- Telegram order notifications
- Admin panel for adding/editing/deleting products
- Product image upload from admin via Supabase Storage
- Local fallback mode when Supabase is not configured yet

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Environment variables

Copy `.env.example` to `.env.local` and fill it:

```bash
cp .env.example .env.local
```

### Required

- `ADMIN_PASSWORD`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

### Optional for live product management

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

If Supabase is not configured, the storefront still works with the local seed catalog, but admin CRUD changes will not persist live.

## Supabase setup

1. Create a free Supabase project.
2. Open the SQL editor.
3. Paste `supabase/schema.sql` and run it.
4. Put `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and optionally `SUPABASE_STORAGE_BUCKET` into Netlify environment variables.
5. The first admin image upload will automatically create a public storage bucket if it does not already exist.

## Netlify deployment

1. Push this folder to GitHub.
2. Import the repo into Netlify.
3. Add environment variables from `.env.example`.
4. Build command:

```bash
npm run build
```

5. Publish directory: leave default for Next.js on Netlify.

## Admin access

- Public site: `/`
- Admin login: `/admin/login`
- Admin dashboard: `/admin`

## Order flow

Customer chooses a product, fills:
- Nom complet
- Téléphone
- Ville
- Adresse
- Produit
- Taille
- Quantité
- Couleur
- Note

Then the app:
1. sends the order to your Telegram bot
2. saves the order in Supabase if configured

## Notes

- No secrets are hardcoded in the codebase.
- The 3D scene is procedural so you can deploy without external assets.
- Product images are local SVG placeholders that you can replace later.
