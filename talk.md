# Digital Knight — Let's Talk (Booking)

Implementation brief for the bespoke Let's Talk CTA. This document is written for the agent that will build it: every decision is explained so it can be defended, modified, or inherited without losing intent.

Source of truth for UX: `home.md:16-47`. Source of truth for design rails: `design.md`. Source of truth for tech posture: `stack.md`.

---

## 0. What is being built

A single, brand-integrated week grid on the home page that turns a visitor into a booked 30-minute consultation in one click, then hands them an `.ics` file plus Google / Outlook deep-links.

**UX invariants (from `home.md:16-30`, locked):**

- Fields: name, email. Time and date are selected from the grid, not typed.
- Availability window: **Monday–Thursday, 10:00–15:00**. 30-minute slots. Ten slots per day, forty per week.
- Default view: **current week**, week grid.
- Navigation: **previous / next week only**. No month or year picker. Past weeks are never reachable.
- **One click on a free slot creates the appointment** — the click is the commit, not a preview.
- Hover on any slot surfaces the full timeslot label (start–end, localized).
- Post-booking: visitor is offered Google, Outlook, and Apple Calendar add-links.

**Out of scope for v1:**

- Spam protection (deferred)
- Rescheduling, cancellation by the visitor.
- Google Calendar freebusy sync (availability is owned purely by the `bookings` table).
- A separate `/talk` route. The block lives on `/`.

---

## 1. Tech stack for this feature

| Concern              | Choice                         | Package                   |
| -------------------- | ------------------------------ | ------------------------- |
| Data                 | Supabase (Postgres + RLS)      | `@supabase/supabase-js`   |
| Server mutation      | Next 16 Server Actions         | built-in                  |
| Email                | Resend                         | `resend`                  |
| Email templating     | React Email                    | `@react-email/components` |
| ICS generation       | `ics`                          | `ics`                     |
| Date / timezone math | `@internationalized/date`      | `@internationalized/date` |
| UI                   | React 19 + SCSS Modules + GSAP | (already installed)       |

No other runtime dependencies. No date picker libraries, no scheduling libraries, no calendar widgets.

---

## 2. Canonical timezone

Business hours are defined in **one fixed timezone** — the host's. Visitors see slots rendered in **their own local timezone** with a clear indicator of what the business hours are.

- Config: `BUSINESS_TIMEZONE` env var. Default `Australia/Melbourne`. Changing this is a deployment-level decision, never a per-request one.
- Storage: `timestamptz` in Postgres — always UTC under the hood.
- Client rendering: `ZonedDateTime` from `@internationalized/date` converts to the visitor's resolved timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`).
- The grid labels each column with the date in the **visitor's** timezone. A meta-type subtitle declares: "Shown in your time (`America/New_York`) · Business hours 10:00–15:00 Melbourne."
- DST transitions: `@internationalized/date` handles them correctly. Write a single unit test for the spring-forward week in the host timezone to protect this.

This decision keeps slot identity unambiguous: a slot is "2026-04-27 10:00 Australia/Melbourne", period. The visitor's view is a presentation concern.

---

## 3. Data model

One table, one view, one RPC. Keep it this small.

### 3.1 Table — `bookings`

```sql
create table public.bookings (
  id           uuid primary key default gen_random_uuid(),
  start_at     timestamptz not null,
  duration_min smallint    not null default 30,
  name         text        not null check (length(name) between 1 and 120),
  email        text        not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at   timestamptz not null default now(),
  canceled_at  timestamptz,

  constraint bookings_start_at_unique unique (start_at),
  constraint bookings_slot_valid      check (
    extract(minute from start_at at time zone 'UTC') in (0, 30)
  )
);

create index bookings_start_at_idx on public.bookings (start_at);
```

**Why these choices:**

- `unique (start_at)` is the atomic concurrency guard. Two simultaneous bookings for the same slot → one succeeds, the other fails with code `23505` and the UI shows "just taken, pick another."
- `canceled_at` is nullable, set in the future when cancellation is added. Availability queries filter `canceled_at is null`.
- No timezone column on the row — `timestamptz` already stores UTC. The business timezone is a deployment constant, not a per-row attribute.
- Email regex is deliberately loose (RFC 5322 full is pointless); stricter validation is a Zod job in the action layer.

### 3.2 Row Level Security

```sql
alter table public.bookings enable row level security;

-- Deny everything by default.
-- The server uses the service role key, which bypasses RLS.
-- No anon policies are granted. This table is never reachable from the client.
```

The client never talks to Supabase directly. All access is through Server Actions running with the service role key.

### 3.3 RPC — `get_week_availability(week_start_utc timestamptz)`

```sql
create or replace function public.get_week_availability(week_start_utc timestamptz)
returns table (start_at timestamptz)
language sql
stable
as $$
  select b.start_at
  from public.bookings b
  where b.canceled_at is null
    and b.start_at >= week_start_utc
    and b.start_at <  week_start_utc + interval '7 days'
  order by b.start_at;
$$;
```

Returns only booked slot timestamps. The client reconstructs the 40-slot grid locally and marks returned timestamps as taken. This keeps payloads tiny and the server logic trivial.

---

## 4. Availability logic

Availability is **generated**, never stored. The grid for a given week is a pure function:

```
generateWeekSlots(weekStartInBusinessTZ) -> ZonedDateTime[40]
  = for day in [Mon, Tue, Wed, Thu]:
      for hour in [10, 11, 12, 13, 14]:
        for minute in [0, 30]:
          ZonedDateTime(weekStart + day, hour, minute, BUSINESS_TIMEZONE)
```

The booked set from `get_week_availability` is subtracted at render time. The current week additionally hides slots whose `start_at < now()` — past slots in an ongoing week are never offered.

**Week boundaries:**

- A "week" starts Monday 00:00 in the **business timezone**.
- `weekISO` identifier format: ISO week — `2026-W17`. Stable, sortable, unambiguous, timezone-free on the wire.
- `ZonedDateTime.set({ weekday: 'mon' })` produces the week start; convert to UTC for the RPC call.

**Navigation limits:**

- Previous: disabled when the visible week is the current week (no past weeks, ever).
- Next: enabled up to `BOOKING_HORIZON_WEEKS` ahead (default 8). Beyond that, "Reach out directly" fallback.

---

## 5. API contract — Server Actions

Two actions, one file: `src/app/_actions/booking.ts`. Both run in a Node runtime (not Edge — Resend and service-role clients benefit from the standard runtime).

### 5.1 `getWeekAvailability(weekISO: string): WeekAvailability`

```ts
type WeekAvailability = {
  weekISO: string; // echoed back
  weekStartUTC: string; // ISO timestamp
  businessTimezone: string; // e.g. 'Australia/Melbourne'
  bookedSlotsUTC: string[]; // ISO timestamps
  horizonReached: boolean; // true if this is the last reachable week
};
```

- Validates `weekISO` against current + `BOOKING_HORIZON_WEEKS`.
- Cached with `unstable_cache` under tag `bookings:${weekISO}`.
- Revalidated by the write action below.

### 5.2 `createBooking(input: BookingInput): BookingResult`

```ts
type BookingInput = {
  name: string;
  email: string;
  startAtUTC: string; // ISO timestamp — the source of truth
  visitorTimezone: string; // for the confirmation email rendering
};

type BookingResult =
  | { ok: true; id: string; icsBase64: string; links: CalendarLinks }
  | { ok: false; reason: 'slot_taken' | 'slot_invalid' | 'validation' | 'server' };

type CalendarLinks = {
  google: string;
  outlook: string;
  // apple = data URI built from icsBase64 on the client
};
```

**Server flow (strict order):**

1. **Zod-validate** `input`. Name 1–120 chars, email RFC-ish, `startAtUTC` parseable.
2. **Slot validity** — rebuild the slot grid for the slot's week and confirm `startAtUTC` is a member. Rejects fabricated timestamps outright.
3. **Insert** into `bookings`. On `23505` unique violation return `slot_taken`.
4. **Build ICS** — organizer = Digital Knight host address, attendee = visitor email, title, description, 30-min duration. Base64 the bytes for transport.
5. **Send email** via Resend with the React Email template. Attach the ICS file. Fire-and-forget retry via a small queue wrapper — if email fails, the booking still stands; we log and surface a soft notice, we do not roll back the row.
6. **Revalidate** `bookings:${weekISO}` tag so the grid refreshes immediately for other open tabs.
7. **Return** `{ ok: true, id, icsBase64, links }`.

**Why not split into `/api/book` Route Handler:** Server Actions give typed input/output across the boundary, automatic CSRF, integrate with `revalidateTag`, and compose with React transitions for pending UI. The Route Handler form adds surface area with no gain here.

---

## 6. Component tree

One feature, clean tree. Lives at `src/components/LetsTalk/`.

```
LetsTalk/
  LetsTalk.tsx                 ← Server Component. Fetches current week,
                                 composes the static copy with the client grid.
  LetsTalk.module.scss         ← Section shell, copy layout, ember hairline.

  WeekGrid/
    WeekGrid.tsx               ← Client. Week state, nav, slot selection.
    WeekGrid.module.scss       ← The 4×10 grid. Hairline cells, hover states.

  WeekNav/
    WeekNav.tsx                ← Client. Prev/next arrows, week range label.
    WeekNav.module.scss

  Slot/
    Slot.tsx                   ← Client. Single cell: free | taken | past.
                                 Owns hover-label tooltip + ember focus ring.
    Slot.module.scss

  BookingForm/
    BookingForm.tsx            ← Client. Name + email, inline under grid.
                                 Enabled only when a slot is selected.
    BookingForm.module.scss

  Confirmation/
    Confirmation.tsx           ← Client. Replaces form on success.
                                 Presents Google / Outlook / Apple links.
    Confirmation.module.scss
```

**Rules carried over from `stack.md`:**

- Every top-level class is `.root`. No `.wrapper` / `.container`.
- State is data attributes: `[data-state="free" | "taken" | "past" | "selected"]` on `Slot`.
- Each `.module.scss` imports only design tokens (CSS custom properties). No hardcoded colors, spaces, or durations.

---

## 7. Client state

All client state is local to `WeekGrid`. Nothing leaks to Zustand — the booking UI has no global concerns.

```ts
type UIState =
  | { phase: 'browsing'; weekISO: string; selectedSlotUTC: string | null }
  | { phase: 'submitting'; weekISO: string; selectedSlotUTC: string }
  | { phase: 'confirmed'; booking: BookingResult & { ok: true } }
  | { phase: 'error'; message: string; weekISO: string };
```

A single `useReducer` (or `useActionState` wrapping `createBooking`) drives the transitions. React 19's `useTransition` marks the server action as pending — the clicked slot shows a subtle pending state, the rest of the grid stays interactive.

**Week fetching on client:** `WeekGrid` starts with server-rendered props for the current week. Navigating to a different week calls `getWeekAvailability` inside a transition and swaps the grid in. Subsequent returns to an already-seen week use a simple in-component `Map<weekISO, WeekAvailability>` cache — no need for SWR or TanStack Query.

---

## 8. Motion

Binding to `design.md §6` rails. One kinetic treatment per block. No compounding effects.

- **Slot hover:** `--dur-state` ember underline. Tooltip fades in at `--dur-element`. Keyboard focus matches hover visually, offset ring per `design.md:108`.
- **Slot click:** ember fill sweeps left→right in `--dur-element`; during the server action, the cell shows a thin animated hairline.
- **Week change:** grid outgoing slots translate 8px left and fade; incoming slides from 8px right, staggered per column at `--dur-scene`. One GSAP timeline ID: `letstalk-week`.
- **Success:** form collapses; confirmation slides up at `--dur-scene` with an ember-draw underline across "Booked" in the header.
- **Reduced motion:** all of the above collapse to opacity crossfades at `--dur-state`. One check, one branch, per `design.md:103`.

---

## 9. Email & ICS

### 9.1 Template — `src/emails/BookingConfirmation.tsx`

React Email component. Brand-faithful:

- Page ink background, Iron text, one ember hairline under the title.
- Meta-type eyebrow: "DIGITAL KNIGHT · CONFIRMED".
- Body: rendered time in **both** the visitor's timezone and business timezone.
- Attached: `.ics` with visitor as attendee, host as organizer.

### 9.2 ICS contents

```
SUMMARY:      Digital Knight — Strategy Call
DESCRIPTION:  Free 30-minute digital strategy meeting. (taken from home.md:33)
DURATION:     PT30M
ORGANIZER:    CN=Digital Knight; mailto:HOST_EMAIL
ATTENDEE:     CN=<name>; RSVP=FALSE; mailto:<email>
UID:          <booking.id>@digital-knight.<domain>
DTSTART:      <start_at in UTC>
DTEND:        <start_at + 30m in UTC>
LOCATION:     (left blank for v1 — agenda confirmation sent manually)
```

UID is the booking UUID — makes updates/cancellations possible later without ambiguity.

### 9.3 Add-to-calendar deep-links

Built client-side, no dependency. Exported from `src/lib/booking/calendarLinks.ts`:

```ts
googleLink({ title, start, end, description }) =>
  `https://calendar.google.com/calendar/render?action=TEMPLATE&...`

outlookLink({ title, start, end, description }) =>
  `https://outlook.live.com/calendar/0/action/compose?...`

appleLink(icsBase64) => `data:text/calendar;base64,${icsBase64}`
```

All three are shown on the confirmation screen. Apple users get a downloadable `.ics`; Google and Outlook open a pre-filled event page.

---

## 10. Environment variables

Declared in `.env.local` and validated at boot in `src/lib/env.ts` with Zod. Fail fast on missing values.

```
# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=       # server only. Never NEXT_PUBLIC_*.

# Resend
RESEND_API_KEY=
BOOKING_FROM_EMAIL=hello@...      # verified sender
BOOKING_HOST_EMAIL=spencer@...    # organizer in ICS + BCC on confirmations

# Booking config
BUSINESS_TIMEZONE=Australia/Melbourne
BOOKING_HORIZON_WEEKS=8
```

Nothing in this list is exposed to the client. The public `@supabase/supabase-js` anon key is not used by this feature — there is no client-side data path.

---

## 11. File additions

Only new files. Existing structure from `stack.md:121-174` is untouched.

```
src/
  app/
    _actions/
      booking.ts                ← getWeekAvailability, createBooking

  components/
    LetsTalk/                   ← full tree from §6

  emails/
    BookingConfirmation.tsx     ← React Email template

  lib/
    env.ts                      ← Zod-validated process.env
    supabase/
      server.ts                 ← service-role client, server-only
    booking/
      config.ts                 ← BUSINESS_TIMEZONE, HORIZON, slot shape
      slots.ts                  ← generateWeekSlots, isValidSlot
      week.ts                   ← weekISO ↔ ZonedDateTime helpers
      calendarLinks.ts          ← google / outlook / apple builders
      ics.ts                    ← buildICS(booking) -> base64

supabase/
  migrations/
    0001_bookings.sql           ← table, constraints, RLS
    0002_get_week_availability.sql  ← RPC
```

---

## 12. Build order

Each step leaves the tree green and deployable. Do not merge steps.

1. **Supabase bootstrap.** Create project, apply migrations `0001` and `0002`, confirm RLS denies anon reads/writes. Capture keys into `.env.local`.
2. **`lib/env.ts`.** Zod schema, single `env` export. Referenced by every server file from here on.
3. **`lib/booking/*`.** Pure functions with unit tests — slot generation, weekISO math, DST edge case (one test is enough, but it has to exist).
4. **`lib/supabase/server.ts`.** Service-role client. Marked `import 'server-only'` at the top of the file.
5. **`app/_actions/booking.ts`.** Both actions. Zod input, typed output. Covered by integration tests hitting a Supabase branch or local instance.
6. **`emails/BookingConfirmation.tsx` + `lib/booking/ics.ts`.** Render the email with sample data via React Email's preview; verify the ICS opens in Apple Calendar.
7. **`components/LetsTalk/`.** Build in the order: `Slot` → `WeekGrid` → `WeekNav` → `BookingForm` → `Confirmation` → `LetsTalk`. Static styling first, motion last.
8. **Integrate into `src/app/page.tsx`.** As its own section beat per `design.md §9` — likely the **Call** beat.
9. **Reduced-motion pass.** Verify all transitions collapse cleanly.
10. **Accessibility pass.** Keyboard-only traversal of the grid, focus rings visible, aria-live on the confirmation swap, visible labels for every slot.

---

## 13. Invariants a future agent must preserve

- **Slot identity is the UTC timestamp.** Not a row id, not a week+index pair. If a slot's UTC time changes, it is a different slot.
- **The visitor never types a time.** If a field creeps in that accepts a date or time, the design has drifted.
- **No past slots are ever visible or reachable.** The current week may render with fewer than 40 slots.
- **Email delivery is not a gate on booking success.** A booked row stands even if Resend fails; the UI shows a soft notice with the host email.
- **The client never holds a Supabase key.** All data access is through Server Actions.
- **One ember per view.** The booking block uses ember for the selected slot's fill and the confirmation underline — not for hover states on unselected slots, not on the prev/next arrows.

---

## 14. Future extensions (flagged, not built)

- **Google Calendar freebusy** — service-account read of the host's calendar, unioned with the `bookings` table in `get_week_availability`. Turns the block into a live reflection of actual availability.
- **Cancellation link** — signed token in the confirmation email routing to a cancel action that sets `canceled_at`.
- **Per-slot custom durations** — add `duration_min` to the slot generator and surface longer meeting types.

These are anticipated, not scoped. v1 ships without them.

---

## 15. Implemented hardening

- **Spam filters** — `BookingForm` carries an off-screen honeypot input and a `performance.now()` dwell-time ref; `createBooking` rejects with `reason: 'spam'` if the honeypot is filled, dwell < 1.5 s, or the email's domain is in `src/lib/booking/disposableEmailDomains.ts`. The UI surfaces the same generic message as a validation failure.
- **HMAC-signed slot tokens** — `getWeekAvailability` issues a fresh `${issuedAtMs}.${hmac16}` token for every free slot via `src/lib/booking/slotToken.ts`. `createBooking` verifies the token with `crypto.timingSafeEqual` and a 30-minute max age before any DB work; a bad or expired token is a `slot_invalid`. The signing key is `BOOKING_SLOT_SIGNING_KEY` (`env.ts`, dev fallback + prod throw).
- **No new runtime deps.** Honeypot + dwell are inline, token signing uses `node:crypto`, the blocklist is a literal `Set`. Tokens are regenerated per request; the `bookedSlotsUTC` cache is untouched.
