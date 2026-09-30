-- Bacchus reservations (table requests) — Neon / any Postgres.
-- Run once: psql "$DATABASE_URL" -f db/schema.sql   (or paste into the Neon SQL editor)

create extension if not exists "pgcrypto";

do $$ begin
  create type reservation_status as enum ('pending', 'confirmed', 'declined', 'cancelled');
exception when duplicate_object then null; end $$;

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  date date not null,
  time text not null,
  guests int not null check (guests between 1 and 20),
  hotel text,
  phone text not null,
  email text,
  special_request text,
  language text not null default 'en' check (language in ('en', 'el')),
  source text not null default '/' check (source in ('/', '/book')),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  gclid text,
  ip_hash text,
  status reservation_status not null default 'pending'
);

create index if not exists reservations_created_at_idx on reservations (created_at desc);
create index if not exists reservations_date_idx on reservations (date, time);
create index if not exists reservations_ip_hash_idx on reservations (ip_hash, created_at desc);
