# Supabase — Let's Talk

The booking feature owns a single table (`public.bookings`) and one RPC
(`get_week_availability`). This folder holds its schema and the CLI
configuration used to ship migrations to a **cloud** Supabase project.

We don't run the local stack, so **Docker is not required**. If you ever
want to flip local dev on (`supabase start`), re-enable the services in
`config.toml` and add `db:start` / `db:reset` scripts back — the wiring
is unchanged.

## Prerequisites

- A Supabase cloud project (create one at
  [supabase.com/dashboard](https://supabase.com/dashboard)).
- The Supabase CLI — already installed as a devDependency; no global
  install needed.

## One-time setup

```bash
pnpm db:login                           # stores an access token
pnpm db:link --project-ref <ref>        # binds this repo to the project
pnpm db:push                            # applies supabase/migrations/*.sql
pnpm db:sync-env                        # writes URL + service_role → .env.local
pnpm db:types                           # emits src/lib/supabase/database.types.ts
```

Or in one shot, after `db:login`:

```bash
pnpm db:setup                           # link → push → sync-env → types
```

You also need Resend env vars for confirmation emails — populate them in
`.env.local` by hand (dashboard → API Keys). See `.env.example`.

## Making a schema change

```bash
# 1. Make the change in the dashboard SQL editor OR edit a new migration file.
# 2. If you changed it in the dashboard, capture it as a local migration:
pnpm db:diff <snake_case_name>          # writes supabase/migrations/<ts>_<name>.sql

# 3. Commit, then push to the cloud (idempotent — only new migrations run):
pnpm db:push
pnpm db:types                           # regenerate TS types
```

## Shipping to production (Vercel)

Set these in **Vercel → Project → Environment Variables**:

| Key | Source |
| --- | --- |
| `SUPABASE_URL` | Dashboard → Settings → API → `Project URL` |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard → Settings → API → `service_role` |
| `RESEND_API_KEY` | Resend dashboard → API Keys |
| `BOOKING_FROM_EMAIL` | Any verified sender on your Resend domain |
| `BOOKING_HOST_EMAIL` | Where the BCC copy of every confirmation lands |

Two-project pattern (recommended): one cloud project for development,
one for production. Both tiny on the free tier. Keeps prod data out of
the loop while you're iterating on the UI.

## RLS posture

RLS is enabled on `public.bookings` with zero public policies. All reads
and writes happen in Server Actions through the service-role key, which
bypasses RLS. Defence-in-depth is layered on top:

- `anon` and `authenticated` have **no** table privileges on
  `public.bookings`.
- `get_week_availability(timestamptz)` has **no** `EXECUTE` for
  `anon` / `authenticated` / `public` — only `service_role` can call it.
- The RPC pins `search_path = public, pg_temp` so an attacker-owned
  schema cannot shadow `public.bookings`.

Periodically audit:

```sql
-- 1. No policies on bookings.
select polname, polcmd
from pg_policy
where polrelid = 'public.bookings'::regclass;
-- expect: zero rows.

-- 2. No table grants for client roles.
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name   = 'bookings'
  and grantee in ('anon','authenticated','public');
-- expect: zero rows.

-- 3. No RPC execute for client roles.
select r.rolname, has_function_privilege(r.rolname,
  'public.get_week_availability(timestamptz)', 'EXECUTE') as can_execute
from pg_roles r
where r.rolname in ('anon','authenticated','service_role');
-- expect: service_role = true, anon/authenticated = false.
```
