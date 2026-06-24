# The DOA Archive

A classified intelligence portal for a military sci-fi novel — built as a full-stack, mobile-first SPA. The Department of Otherworldly Affairs is a fictional government agency; the Archive is the database they'd actually use.

**[Live App](https://doa-archive-wiki.vercel.app/) · [Demo Video](https://youtu.be/G9pqtYeAwN0?si=RWH5Jmcp8QHPfeN1) · [Author](https://keithhayden.net/)**

---

## Features

- **Role-based access** — three tiers: Guest, Member, and Admin, enforced at both the UI and the database layer via Supabase Row-Level Security
- **Gated content** — each wiki entry has a public summary and a classified section; guests see a lock screen, members see everything
- **Booker AI** — an in-world AI enhanced whose response depth changes based on your clearance level; semantic search via OpenAI embeddings with keyword fallback
- **Stripe membership** — one-time $1 payment upgrades a Guest to Member; handled via Supabase Edge Functions and a Stripe webhook
- **Admin CRUD** — admins can create, edit, and publish entries with image uploads via Supabase Storage
- **Cold-start UX** — animated "INITIALIZING SECURE CHANNEL" loading screen while the Supabase free-tier instance wakes

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS v4 + custom design tokens |
| Backend / Auth / DB | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| AI (embeddings) | OpenAI Embeddings API |
| Payments | Stripe Checkout + Stripe Webhooks |
| Hosting | Vercel |

## Local Development

### Prerequisites

- Node.js 18+
- A Supabase project
- A Stripe account (for payment features)
- An OpenAI API key (for entry embeddings)

### Setup

1. Clone the repo and install dependencies:

```bash
cd doa_archive
npm install
```

2. Copy `.env.example` to `.env` and fill in your keys:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

3. Start the dev server:

```bash
npm run dev
```

### Other Commands

```bash
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint
```

## Architecture

### User Roles

| Role | Auth State | Access |
|---|---|---|
| Guest | Unauthenticated | Public entry content, surface-level Booker responses |
| Member | Authenticated + `is_member: true` | Full entry content, deeper Booker responses |
| Admin | Authenticated + `is_admin: true` | Everything above + full CRUD on entries |

Role flags live in the `profiles` table (which extends Supabase's `auth.users`). `AuthContext` fetches them on every session resolve so they're always current. `isMember` is derived as `is_member === true || is_admin === true` — admins inherit member access automatically.

### Gated Content

Each `entries` row has `public_content`, `gated_content`, and `is_gated: boolean`. Supabase RLS policies prevent `gated_content` from being returned to unauthenticated requests — the UI lock screen is UX on top of real data enforcement, not the only layer of protection.

### Booker for Wiki Search

Booker is the wiki guide. User can query him to surface entries. Semantic search is powered by OpenAI embeddings. When an entry is published, an `embed-entry` Edge Function generates a vector embedding via the OpenAI Embeddings API and stores it in the database. At query time, the function performs a vector similarity search against those embeddings; if none are populated it falls back to keyword search. The `isMember` flag is passed in the request body, and the Claude system prompt varies by clearance level so response depth differs between guests and members.

### Stripe Payment Flow

1. User clicks "Unlock Access — $1" on a gated entry
2. Frontend calls the `stripe-checkout` Edge Function, which creates a Stripe Checkout Session with the user's ID in `payment_intent_data.metadata`
3. Stripe redirects the user to the hosted checkout page
4. On success, Stripe redirects to `/payment/success` and fires a webhook to the `stripe-webhook` Edge Function
5. The webhook verifies the signature, then sets `is_member: true` on the user's profile
6. The success page polls `refreshProfile()` every 2 seconds until `is_member` is confirmed before showing the "Enter Archive" button

### Database Schema

```
profiles       — id (→ auth.users), is_admin, is_member
entries        — slug, title, file_no, entry_type, classification, status,
                 public_content, gated_content, is_gated, image_url, detail_fields
payments       — user_id, amount, stripe_payment_intent_id, status
```

## Key Design Decisions

- **No backend server** — Supabase Edge Functions handle all server-side logic (auth verification, Stripe, Claude). 
- **RLS over UI gating** — gated content is protected at the database query level, not just hidden in React. A user inspecting API responses won't see `gated_content` without a valid session.
- **Mobile-first terminal aesthetic** — max content width is 600px, maintaining a "mobile terminal" aspect ratio on wide screens. All UI chrome uses `Share Tech Mono` (uppercase, expanded tracking); narrative body text uses `Rajdhani`. No box shadows — depth is communicated through border weight and tonal layering only.

## Future Implementation

- Add a service worker + web manifest for PWA / installable app support
