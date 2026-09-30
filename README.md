# Bacchus Restaurant — bacchus.gr

Family-run Greek seafood taverna on Messonghi Beach, Corfu. This repo is the production website built from the Claude Design handoff in [`docs/handoff`](docs/handoff).

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind v4 · Motion · Neon Postgres · Resend / SMTP · Vercel.

## Pages

| Route | What |
|---|---|
| `/` · `/el` | Homepage (EN / GR). Story, today's catch, menu, gallery, evenings, reviews, find us, booking sheet |
| `/book` · `/el/book` | Google Ads landing: fast table request → WhatsApp |
| `/admin` | Owner admin (password): list requests, change status, one-tap WhatsApp reply templates EN/GR |
| `/api/reservations` | `POST` — validates, rate-limits, stores the request in Postgres, emails owner + guest |
| `/llms.txt` · `/sitemap.xml` · `/robots.txt` | Agent / SEO endpoints |

Legacy PHP URLs (`/index.php`, `/photos.php`, `/contact.php`, `/images/Food/*`) 301 to the new site — see `next.config.ts`.

## Run locally

```bash
pnpm install
cp .env.example .env.local   # fill in what you have; the site works with none of it
pnpm dev                     # http://localhost:3000  (Greek: /el)
```

Without a database / email configured the booking flow still works: the request is validated and the guest is handed to WhatsApp; the summary shows "not saved — send via WhatsApp".

## Content the owner can edit (no code)

| File | Contents |
|---|---|
| `content/catch.json` | Today's catch list (EN/EL) |
| `content/plates.json` | Six menu categories: title, photo, description (EN/EL). No prices unless verified |
| `content/reviews.json` | Guest quotes |
| `content/gallery.json` · `content/album.json` | Gallery photos + heritage album captions |
| `content/hours.json` | Season dates and opening hours → also feed JSON-LD |
| `content/messages.json` | WhatsApp / email templates (EN/EL) |
| `public/images/**` | Photos and video (filenames are final; referenced in JSON-LD) |

Copy and UI strings live in `lib/i18n.ts` (`en` / `el`). Greek review notes: [`docs/TRANSLATION.md`](docs/TRANSLATION.md).

## Set-up checklist (one-time)

1. **Database** — Neon Postgres via the Vercel marketplace (free plan, no auto-pausing): Vercel → Storage → Neon, connect to the `bacchus` project; it injects `DATABASE_URL`. Then run `db/schema.sql` once in the Neon SQL editor. Set `ADMIN_PASSWORD` for `/admin`.
2. **Email** — sign up at resend.com, add domain `bacchus.gr`, add its 3 DNS records at IP.gr, set `RESEND_API_KEY`, `OWNER_EMAIL`, `FROM_EMAIL`. (Fallback: `SMTP_*` for the IP.gr mailbox.)
3. **Vercel** — project `bacchus` in the Lupe Analytics team (Hobby plan). Public env vars and both domains are already set; canonical host is `https://www.bacchus.gr`. Deploy with `pnpm exec vercel deploy --prod`.
4. **DNS / go-live** — follow [`docs/MIGRATION.md`](docs/MIGRATION.md) step by step (the old server also hosts the mailbox — read the warning there first).
5. **Analytics** — `NEXT_PUBLIC_GTM_ID` (or GA4 / Meta Pixel). Events pushed to `dataLayer`: `view_booking`, `start_booking`, `submit_booking`, `whatsapp_booking_click`, `directions_click`, `phone_click`, `menu_view`. UTM / gclid persist in `sessionStorage` and are stored with each request.
6. **Google** — Search Console (verify, submit sitemap), Business Profile links: website `/`, menu `/#menu`, reservations `/book?utm_source=google&utm_medium=gbp`. Google Ads final URL `/book`, conversions `submit_booking` + `whatsapp_booking_click`.

## Scripts

```bash
pnpm dev / build / start / lint
node scripts/generate-assets.mjs   # regenerate favicon, apple icon, OG images
```

## Open items (from the handoff)

- Vector redraw of the emblem (source is 83×70 px) — currently used ≤ 83 px only.
- Hero drone video is 7.4 MB; re-export trimmed & compressed (~2–3 MB, 1080p H.264). It only loads on desktop and only plays in view.
- High-res scan of Dimitris & Yana (currently the 800×600 legacy photo, now hosted locally at `public/images/heritage/dimitris-and-yana-early-years.jpg`).
- Instagram / Facebook URLs (`NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL`), Google Place ID for a live rating.
- `lib/config.ts` → `GEO` is approximate; copy the exact pin from Google Business Profile.
- Cormorant Garamond has no Greek glyphs; Greek headlines fall back to Noto Serif Display Light (loaded via `next/font`). Swap if a different Greek serif is preferred.
