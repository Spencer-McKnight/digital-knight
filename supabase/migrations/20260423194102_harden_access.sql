-- ============================================================================
-- Harden the Let's Talk surface against accidental client-side access.
-- ============================================================================
--
-- Posture:
--   The booking feature is a server-action-only feature. The service role
--   (bypassrls) is the only access path. `anon` and `authenticated` must
--   have no reachable path to either the `bookings` table or the
--   `get_week_availability` RPC — directly or via the PostgREST surface.
--
--   RLS already denies row access by default. This migration adds the
--   matching privilege layer and pins the RPC's search_path so a malicious
--   caller can't shadow `public.bookings` via an attacker-controlled
--   schema. Defence in depth.
--
-- Audit invariant (see supabase/README.md):
--   `select polname, polcmd from pg_policy where polrelid = 'public.bookings'::regclass;`
--   must continue to return zero rows.
-- ============================================================================

-- ── Table privileges ────────────────────────────────────────────────────────
-- Strip every table-level right from the client-facing roles. With RLS on,
-- this is redundant for SELECT/INSERT/UPDATE/DELETE — it matters for the
-- side-channels (TRUNCATE, REFERENCES, TRIGGER) and it documents intent.
revoke all on table public.bookings from anon, authenticated;

-- Prevent the `public` pseudo-role from granting future table access by
-- default when new migrations CREATE TABLE under public. (Keeps the blast
-- radius of a sloppy future migration contained to this table.)
revoke all on table public.bookings from public;

-- ── RPC privileges ──────────────────────────────────────────────────────────
-- PostgREST exposes any function in the `public` schema whose signature
-- matches the API. Revoking EXECUTE is what actually takes it off the
-- wire for `anon` / `authenticated`.
revoke execute on function public.get_week_availability(timestamptz)
  from public, anon, authenticated;

grant execute on function public.get_week_availability(timestamptz)
  to service_role;

-- ── Pin the RPC's search_path ───────────────────────────────────────────────
-- Without an explicit search_path, a function resolves unqualified names
-- against the caller's search_path. A hostile caller could create a
-- `bookings` view in a schema they own and trick the function into
-- reading it. Pinning to `public, pg_temp` closes that door and is cheap.
--
-- We re-declare the function here (rather than ALTER FUNCTION ... SET) so
-- the full current definition lives in one place a reviewer can read.
create or replace function public.get_week_availability(week_start_utc timestamptz)
returns table (start_at timestamptz)
language sql
stable
set search_path = public, pg_temp
as $$
  select b.start_at
  from public.bookings b
  where b.canceled_at is null
    and b.start_at >= week_start_utc
    and b.start_at <  week_start_utc + interval '7 days'
  order by b.start_at;
$$;

-- The CREATE OR REPLACE above resets grants on the function — re-apply.
revoke execute on function public.get_week_availability(timestamptz)
  from public, anon, authenticated;
grant  execute on function public.get_week_availability(timestamptz)
  to service_role;
