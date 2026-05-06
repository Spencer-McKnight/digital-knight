# Digital Knight — Contact Page

Spec and implementation plan for `/contact`. Modelled on the reference layout (two-column: copy left, form right) adapted to the Digital Knight design system.

Source of truth for design rails: `design.md`. Source of truth for tech posture: `home.md`. Source of truth for form anti-spam patterns: `talk.md §15`.

---

## 0. What is being built

A standalone `/contact` route with a general-purpose enquiry form. Two-column layout on desktop: left column carries a headline, supporting copy, and optional trust signals; right column is a white card holding the form.

**Form fields (matching the reference):**

| Field        | Type       | Required | Notes                                               |
| ------------ | ---------- | -------- | --------------------------------------------------- |
| Name         | text       | yes      | `autocomplete="name"`, max 120 chars                |
| Organisation | text       | no       | `autocomplete="organization"`, max 120 chars        |
| Email        | email      | yes      | `autocomplete="email"`, max 254 chars               |
| Budget       | select     | no       | Predefined ranges, placeholder "Select one..."      |
| Message      | textarea   | yes      | Max 2000 chars, resizable vertically                |

**Budget options (editable in config, not hardcoded in JSX):**

```ts
const BUDGET_OPTIONS = [
  { value: 'under-5k',  label: 'Under $5,000' },
  { value: '5k-10k',    label: '$5,000 – $10,000' },
  { value: '10k-25k',   label: '$10,000 – $25,000' },
  { value: '25k-50k',   label: '$25,000 – $50,000' },
  { value: '50k-plus',  label: '$50,000+' },
  { value: 'not-sure',  label: 'Not sure yet' },
] as const;
```

**Out of scope for v1:**

- File attachments.
- Multi-step form / conditional fields.
- Third-party form services (Typeform, Formspree, etc.).

---

## 1. Form library decision

**Recommendation: native HTML form elements + Zod validation + Server Action.**

Why not a form library (React Hook Form, Formik, etc.):

- Five fields, no conditional logic, no arrays — the complexity doesn't warrant a dependency.
- Native `<input>`, `<select>`, `<textarea>` render clean, unstyled DOM that SCSS modules can fully control. No wrapper divs to fight.
- Server Actions give typed input/output, automatic CSRF, and `useActionState` for pending UI — exactly the pattern already established in `booking.ts`.
- Zod is already installed and used for validation on the booking action.

The existing `BookingForm` component (`src/components/home/LetsTalk/BookingForm/`) proves this pattern works at the project level. The contact form follows the same conventions.

---

## 2. Spam reduction

Integration-light, no third-party services. Three layered signals, same philosophy as `talk.md §15`:

### 2.1 Honeypot field

An invisible `website` field (off-screen, `aria-hidden`, `tabIndex={-1}`). Bots that auto-fill every field populate it; humans never see it. Server rejects any submission where `website` is non-empty.

### 2.2 Dwell-time check

`performance.now()` is captured on component mount. On submit, the elapsed time is calculated. Submissions under 2 seconds are rejected — no human reads five labels, fills three required fields, and submits in under two seconds.

### 2.3 Disposable email domain blocklist

Reuse `src/lib/booking/disposableEmailDomains.ts` (already exists). Server checks the email domain against the `Set`. Rejected with the same generic validation message.

All three checks run server-side in the action. The client collects `formDwellMs` and `website` and forwards them alongside the real fields. No CAPTCHAs, no JS challenges, no third-party scripts.

---

## 3. Server Action — `submitContact`

New file: `src/app/_actions/contact.ts`. Single action, same shape as the booking flow.

```ts
// Input schema
const ContactInput = z.object({
  name:         z.string().min(1).max(120),
  organisation: z.string().max(120).optional().default(''),
  email:        z.string().email().max(254),
  budget:       z.enum([...BUDGET_VALUES, '']).optional().default(''),
  message:      z.string().min(1).max(2000),
  // Anti-spam (not surfaced to user)
  website:      z.string().optional().default(''),
  formDwellMs:  z.number().nonneg(),
});

// Result
type ContactResult =
  | { ok: true }
  | { ok: false; reason: 'validation' | 'spam' | 'server' };
```

**Server flow:**

1. **Zod-validate** input. On failure → `{ ok: false, reason: 'validation' }`.
2. **Spam checks** — honeypot filled, dwell < 2s, or disposable email domain → `{ ok: false, reason: 'spam' }`. Surfaced to the user as a generic validation error (never reveal the signal).
3. **Send email** via Resend to `CONTACT_TO_EMAIL` (env var, defaults to `BOOKING_HOST_EMAIL`). The email contains all form data, formatted with a React Email template.
4. **Store in Supabase** (optional, see §3.1) — insert into `contact_submissions` for audit/backup.
5. **Return** `{ ok: true }`.

### 3.1 Data storage (recommended but deferrable)

A `contact_submissions` table provides a backup if Resend delivery fails and a queryable record for follow-up.

```sql
create table public.contact_submissions (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  organisation   text,
  email          text not null,
  budget         text,
  message        text not null,
  created_at     timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;
-- No anon policies. Server-only via service role.
```

If deferred, the action sends email only and logs failures to `console.error`.

---

## 4. Email template

New file: `src/emails/ContactNotification.tsx`. React Email component.

- **To:** `CONTACT_TO_EMAIL`
- **Subject:** `New enquiry from {name}`
- **Body:** all fields rendered cleanly — name, organisation (if provided), email (as a `mailto:` link), budget (if selected), message.
- **Reply-To:** the submitter's email, so replying goes directly to the lead.
- Brand-faithful: Page ink background, Iron text, ember hairline under the title.

---

## 5. Component tree

Lives at `src/components/contact/ContactSection/`.

```
ContactSection/
  ContactSection.tsx           ← Server Component. Section shell.
  ContactSection.module.scss   ← Two-column layout, section spacing.

  ContactForm/
    ContactForm.tsx            ← Client Component. Form state, submission, spam hooks.
    ContactForm.module.scss    ← Card container, field styling, button.
    contactConfig.ts           ← BUDGET_OPTIONS, field maxlengths.

  ContactSuccess/
    ContactSuccess.tsx         ← Client. Replaces form on success.
    ContactSuccess.module.scss
```

### 5.1 ContactSection (Server Component)

The outer section element. Page-ground, `section-pad(act)` spacing. Two-column grid at `lg` breakpoint (copy left ~40%, form right ~60%). Stacks vertically on mobile (copy above, form below).

Left column content:

- Meta eyebrow: "CONTACT" in `--t-meta`, uppercase, ember color.
- Headline: `--t-hero` scale, Iron. e.g. "Let's Build Something That *Matters*" (ember on one word per `design.md §12`).
- Supporting copy: `--t-lede` scale, one or two sentences. e.g. "You have important work to do. Let's create the website that helps you do it better."

Right column: renders `<ContactForm />`.

### 5.2 ContactForm (Client Component)

A `<form>` inside a card container (subtle background, soft shadow or hairline border per the reference's white-card style — adapted to `--ink-page` with a slight lift via `--ink-shadow`).

**State management:** `useActionState` wrapping the `submitContact` server action, or a simple `useState` + `useTransition` pair (matching the booking pattern). Three phases:

```ts
type Phase = 'idle' | 'submitting' | 'success' | 'error';
```

On success, the form is replaced by `<ContactSuccess />` with a fade transition.

**Field rendering:** native elements, each with:
- Label above in `--t-meta` (matching `BookingForm` pattern).
- Input/select/textarea styled via `.input` / `.select` / `.textarea` classes.
- Hairline-only bottom border on text inputs (per `design.md §8` Input spec).
- Focus: hairline thickens and turns ember.

**Select (Budget):** native `<select>` element. Fully stylable with CSS `appearance: none` + custom chevron. No headless UI library needed for a single dropdown — the native element gives keyboard navigation, mobile-native menus, and accessibility for free.

**Submit button:** full-width, solid Iron fill with Page text. Hover: ember fill sweep (matching `BookingForm` submit pattern). Label: "Send Message".

### 5.3 ContactSuccess

Replaces the form card on `{ ok: true }`. Simple confirmation:

- Checkmark or ember hairline.
- Heading: "Message sent."
- Body: "We'll be in touch shortly."
- Optional: "Send another" link to reset the form.

---

## 6. Styling notes

All SCSS imports `@use 'mixins' as *;` and consumes design tokens only.

**Form card:** The reference shows a white card with soft corners and light grey input backgrounds. Adapted to the DK system:
- Card background: `var(--ink-page)` with a `1px solid var(--ink-rule)` border or a subtle `box-shadow` using `--ink-shadow`.
- Input backgrounds: a very light tint (e.g. `rgba($ink-iron, 0.04)`) for fill, with a hairline bottom border per the design system.
- Rounded corners on the card: `border-radius: 12px` — the card is a container, not a button, so it follows the reference aesthetic while buttons remain square per `design.md §8`.

**Responsive:**
- `lg+`: two-column grid, `gap: var(--space-8)`, copy column ~5fr, form column ~7fr.
- Below `lg`: single column stack, copy then form, `gap: var(--space-6)`.

---

## 7. Route setup

New route: `src/app/contact/page.tsx`.

```tsx
import { ContactSection } from '@/components/contact/ContactSection/ContactSection';

export const metadata = {
  title: 'Contact — Digital Knight',
  description: 'Get in touch to discuss your next project.',
};

export default function ContactPage() {
  return (
    <main>
      <ContactSection />
    </main>
  );
}
```

Add "Contact" to the nav links in `Nav.tsx`.

---

## 8. Environment variables

```
# Contact (reuses existing Resend setup)
CONTACT_TO_EMAIL=spencer@...   # where enquiries land (defaults to BOOKING_HOST_EMAIL)
```

No new API keys. Resend and Supabase credentials are already configured.

---

## 9. File additions

```
src/
  app/
    contact/
      page.tsx                          ← Route
    _actions/
      contact.ts                        ← submitContact server action

  components/
    contact/
      ContactSection/
        ContactSection.tsx
        ContactSection.module.scss
      ContactForm/
        ContactForm.tsx
        ContactForm.module.scss
        contactConfig.ts                ← BUDGET_OPTIONS, field constraints
      ContactSuccess/
        ContactSuccess.tsx
        ContactSuccess.module.scss

  emails/
    ContactNotification.tsx             ← React Email template

supabase/
  migrations/
    XXXX_contact_submissions.sql        ← (if data storage is included)
```

---

## 10. Build order

Each step leaves the tree green and deployable.

1. **`contactConfig.ts`** — budget options, field constraints. Pure data, no deps.
2. **`src/app/_actions/contact.ts`** — server action with Zod validation, spam checks, Resend send. Test with a direct call or via the React Email dev server.
3. **`src/emails/ContactNotification.tsx`** — React Email template. Preview via `pnpm email:dev`.
4. **`ContactForm/`** — client component with all fields, honeypot, dwell-time, submit handling. Static styling first, interactions second.
5. **`ContactSuccess/`** — success state component.
6. **`ContactSection/`** — server component shell, two-column layout, copy.
7. **`src/app/contact/page.tsx`** — route with metadata.
8. **Nav link** — add "Contact" to `Nav.tsx`.
9. **Supabase migration** — `contact_submissions` table (if included).
10. **Accessibility pass** — keyboard traversal, focus rings, `aria-live` on success swap, label associations.
11. **Reduced-motion pass** — collapse transitions to opacity fades.

---

## 11. Invariants

- **The client never holds a Supabase key.** All data access through Server Actions.
- **Spam signals are never revealed to the user.** A rejected spam submission shows the same generic error as a validation failure.
- **No third-party form services.** The form posts to our own Server Action.
- **Budget options live in `contactConfig.ts`, not inline JSX.** Easy to update without touching component code.
- **The select is a native `<select>`.** No headless UI library for a single dropdown.
- **Email delivery failure does not block the success response** if DB storage is enabled (the row is the record of truth). If DB storage is deferred, email failure returns `{ ok: false, reason: 'server' }`.
