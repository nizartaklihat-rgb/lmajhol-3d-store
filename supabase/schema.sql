create extension if not exists "pgcrypto";

create table if not exists products (
  id text primary key,
  slug text not null unique,
  name text not null,
  color text not null default 'Noir',
  price integer not null default 0,
  currency text not null default 'MAD',
  sizes text[] not null default array['M','L'],
  description text not null default '',
  materials text not null default '',
  image text not null default '/products/black-oversized-tee.svg',
  featured boolean not null default false,
  stock_status text not null default 'en_stock',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  product_id text not null,
  product_name text not null,
  size text not null,
  quantity integer not null default 1,
  color text not null,
  note text,
  source text not null default 'website',
  created_at timestamptz not null default now()
);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON products;
create trigger set_products_updated_at
before update on products
for each row
execute function update_updated_at_column();

insert into products (id, slug, name, color, price, currency, sizes, description, materials, image, featured, stock_status)
values
  (
    'white-oversized-tee',
    'white-oversized-tee',
    'Oversized Tee Blanc',
    'Blanc',
    249,
    'MAD',
    array['S','M','L','XL'],
    'Coupe oversize propre, tombé lourd et présence minimaliste pour un look quotidien premium.',
    'Coton lourd premium, coupe ample, col renforcé',
    '/products/white-oversized-tee.svg',
    true,
    'en_stock'
  ),
  (
    'black-oversized-tee',
    'black-oversized-tee',
    'Oversized Tee Noir',
    'Noir',
    249,
    'MAD',
    array['S','M','L','XL'],
    'Version noir profond pour une silhouette plus cinématique et urbaine, pensée pour le layering.',
    'Coton lourd premium, coupe ample, finition dense',
    '/products/black-oversized-tee.svg',
    true,
    'en_stock'
  )
on conflict (id) do nothing;
