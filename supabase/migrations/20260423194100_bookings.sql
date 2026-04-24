-- ============================================================================
-- bookings — the only table the Let's Talk feature owns.
-- ============================================================================
--
-- Concurrency contract:
--   A unique constraint on `start_at` is the atomic guard against two
--   simultaneous bookings for the same slot. One INSERT wins, the other
--   fails with Postgres SQLSTATE 23505; the server turns that into a
--   `slot_taken` response and the client re-fetches the week.
--
-- Source-of-truth:
--   This table and the derived RPC `get_week_availability` are the ONLY
--   mechanism for availability. Slot identity is the UTC timestamp of
--   `start_at`. Never introduce (week, index) pairs as a parallel identity.
--
-- RLS:
--   Denied by default. Service-role key bypasses RLS. No anon policies.
-- ============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id           uuid primary key default gen_random_uuid(),
  start_at     timestamptz not null,
  duration_min smallint    not null default 30,
  name         text        not null check (length(name) between 1 and 120),
  email        text        not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at   timestamptz not null default now(),
  canceled_at  timestamptz,

  constraint bookings_start_at_unique unique (start_at),
  constraint bookings_slot_valid check (
    extract(minute from start_at at time zone 'UTC')::int in (0, 30)
    and extract(second from start_at at time zone 'UTC')::int = 0
  )
);

create index if not exists bookings_start_at_idx on public.bookings (start_at);

alter table public.bookings enable row level security;

-- No anon policies. Reads and writes happen server-side via the service-role
-- key which bypasses RLS. Re-check periodically that no policy has been
-- accidentally granted.
