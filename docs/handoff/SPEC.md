# Bacchus Restaurant — production spec

Design prototypes in this project: `Bacchus Homepage.dc.html`, `Bacchus Book.dc.html`, `Bacchus Brand Sheet.dc.html`. Assets in `/images/{restaurant,food,heritage}`. Agent-readable summary in `llms.txt`.

## Stack
Next.js 15 (App Router, TypeScript), Tailwind, Motion, Supabase, Vercel.
```
/app            page.tsx (home) · book/page.tsx · api/reservations/route.ts · sitemap.ts · robots.ts
/components     sections/* · booking/* · gallery/* · ui/*
/lib            config.ts · analytics.ts · whatsapp.ts · schema.ts · supabase.ts
/content        catch.json · plates.json · reviews.json (owner-editable, or Supabase tables)
/public/images  restaurant/ food/ heritage/  (+ AVIF/WebP via next/image)
```

## Config (env)
- `NEXT_PUBLIC_WHATSAPP_NUMBER=306934693732`
- `NEXT_PUBLIC_PHONE=+302661075301`
- `NEXT_PUBLIC_SITE_URL=https://bacchus.gr`
- `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID` (optional, modular)
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`, `OWNER_EMAIL`, `FROM_EMAIL=bookings@bacchus.gr`
- `BOOKING_SLOTS=18:30,19:00,19:30,20:00,20:30,21:00,21:30,22:00`
- `CHEF_NAME` — staff changes; never hardcode names other than Dimitris (founder) and Yana

## Editable content (CMS / JSON)
- Today's catch: `[{name, how}]`
- Plates: `[{title, img, desc}]` — no prices unless verified
- Reviews: `[{text, by, source}]`; rating/count fetched live (Google Places / TripAdvisor) or omitted
- Hours + season dates → also feed JSON-LD `openingHoursSpecification`

## Booking flow
1. Form (name*, date*, time slot*, guests* −/+, hotel, phone*, notes) + honeypot `website`
2. Client validation → `POST /api/reservations`
3. Server: zod validation, rate limit (IP, 5/10min), honeypot, sanitise, insert `reservations`
4. Return `{id}` → show summary → open `https://wa.me/{number}?text=…` (prefilled, see homepage `waText()`)
5. Copy always says **request**; never "confirmed"

### reservations table
id uuid pk · created_at · name · date · time · guests int · hotel · phone · special_request · language · source ('/'|'/book') · utm_source · utm_medium · utm_campaign · utm_content · utm_term · gclid · status enum(pending|confirmed|declined|cancelled)

## Notifications & replying (owner side)
**Phase 1 (required):** email via Resend (owner signs up at resend.com, verifies bacchus.gr with 3 DNS records at IP.gr) — or fallback to IP.gr SMTP for info@bacchus.gr (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) using nodemailer. Owner replies to guests from WhatsApp Business app via the wa.me link in the email.
**WhatsApp:** no Cloud API. Requests arrive on Yana's personal WhatsApp number (`NEXT_PUBLIC_WHATSAPP_NUMBER`); she replies from the normal WhatsApp app. Owner email includes the one-tap wa.me reply link for convenience.

On every successful `POST /api/reservations`:
1. **Email to owner** via Resend (`RESEND_API_KEY`, `OWNER_EMAIL`): subject "Booking request · {date} {time} · {guests} pax · {name}"; body lists all fields, language, source/UTM, and two one-tap links: **Reply on WhatsApp** (`https://wa.me/{guest phone E.164}?text=…` prefilled confirmation in guest's language) and **Call**. Include an admin link to `/admin/reservations/{id}`.
2. **Email to guest** (if email captured; add optional email field to the form) — "We received your request" — restates it is a request, not a confirmation, with WhatsApp/phone.
3. **WhatsApp**: guest opens wa.me with the prefilled request (client-side, as now) to Yana's number. No API integration.
4. Owner reply: from the email link or WhatsApp thread. Minimal `/admin` (Supabase Auth, magic link, owner emails only): list of requests, status toggle (pending → confirmed/declined), prefilled WhatsApp reply templates in EN/GR ("Your table for {guests} on {date} at {time} is confirmed — Bacchus" / decline with alternative slots). Status change triggers a confirmation email to guest if email present.

Templates (EN/GR) live in `/content/messages.json`.

## Hosting / migration (current host: IP.gr)
- Keep the domain at IP.gr; deploy the new site to Vercel (or IP.gr Node hosting if they support Node 20). Point DNS: `A`/`CNAME` → Vercel; keep MX records untouched.
- Before switch: export the old site as a zip (fallback), add 301s from old paths (`/index.php`, `/menu.html`, `/images/Food/*`) to `/`, `/#menu`, new image paths.
- Verify in Google Search Console after DNS; resubmit sitemap; update Google Business Profile links (website, menu → `/#menu`, reservations → `/book?utm_source=google&utm_medium=gbp`).
- Google Ads: final URL `/book`, auto-tagging on (gclid), conversion = `submit_booking` + `whatsapp_booking_click`.

## Analytics events (dataLayer)
view_booking · start_booking · submit_booking · whatsapp_booking_click · directions_click · phone_click · menu_view. Preserve UTM/gclid in sessionStorage across navigation.

## SEO / agent crawlability
- Unique `<title>`/description per page; OG + Twitter cards; canonical
- Restaurant JSON-LD on every page (name, alternateName "Tavern Bacchus", address, geo, telephone, servesCuisine, priceRange, openingHoursSpecification, acceptsReservations, potentialAction ReserveAction → /book, sameAs TripAdvisor/Google/Instagram/Facebook)
- `robots.txt` allowing all incl. GPTBot, ClaudeBot, PerplexityBot, Google-Extended; `sitemap.xml`
- `/llms.txt` served at root (see file); semantic HTML (`<main>`, `<section aria-labelledby>`, `<figure>/<figcaption>`, descriptive alt text on every photo)
- Target keywords: restaurant Messonghi, seafood Messonghi, fresh fish Corfu, Corfiot restaurant, waterfront restaurant Corfu, Greek restaurant Messonghi
- hreflang en / el (GR toggle exists in prototype; full Greek copy TBD)

## Performance
next/image with AVIF/WebP, `sizes`, lazy below fold; hero `priority`. Video: muted, `preload="metadata"`, play only when ≥50% in view (IntersectionObserver). Respect `prefers-reduced-motion`. Targets: Lighthouse perf >90, a11y >95, SEO >95.

## Breakpoints
390 / 430 mobile (sticky CALL | DIRECTIONS | BOOK bar, hamburger, booking as bottom sheet) · 768 · 1024 (desktop nav) · 1440 · 1728.

## Build order for agents
1. Scaffold Next.js, copy `/images` to `/public/images`, port `Bacchus Homepage.dc.html` section by section (inline styles → Tailwind; keep copy, alt text, EN/GR strings from the `T` object in the logic class).
2. Port `Bacchus Book.dc.html` → `/book`; wire `/api/reservations`, Supabase, Resend, wa.me.
3. JSON-LD, sitemap, robots, llms.txt, OG images.
4. `/admin` + reply templates.
5. Lighthouse pass, 301s, DNS switch.

## Open items
- Vector redraw of the Bacchus emblem (source is 83×70 px)
- Wine photo (HEIC → JPG), high-res original of Dimitris & Yana (old site Food/17 is 800×600)
- Greek translations; Instagram/Facebook URLs; Google Place ID for live rating

## Image & media manifest

All assets live under `images/`. Filenames are semantic and final — agents must keep them (they are referenced by src in the DC files and in JSON-LD). Serve resized AVIF/WebP variants in production; keep originals as the source.

| Path | Used in | Notes |
|---|---|---|
| images/restaurant/bacchus-drone.mp4 | Homepage | |
| images/restaurant/bacchus-from-the-sea-2.jpg | Homepage | |
| images/restaurant/bacchus-from-the-sea-close.jpg | Homepage | |
| images/restaurant/bacchus-from-the-sea-mountain.jpg | Homepage | |
| images/restaurant/bacchus-from-the-sea-wide.jpg | Homepage | |
| images/restaurant/dancing.mp4 | Homepage | |
| images/restaurant/entrance-arch-boardwalk.jpg | Homepage | |
| images/restaurant/evening-full-house.jpg |  | |
| images/restaurant/facade-arch-sky.jpg |  | |
| images/restaurant/facade-from-the-beach-2.jpg |  | |
| images/restaurant/facade-from-the-beach.jpg |  | |
| images/restaurant/greek-night-dancers-2.jpg | Homepage | |
| images/restaurant/greek-night-dancers.jpg | Homepage | |
| images/restaurant/messonghi-bay.jpg | Homepage | |
| images/restaurant/pier-from-the-roof.jpg | Homepage | |
| images/restaurant/pier-messonghi-2.jpg |  | |
| images/restaurant/pier-messonghi.jpg | Homepage | |
| images/restaurant/seafood-pasta-table.jpg |  | |
| images/restaurant/table-on-the-beach.jpg |  | |
| images/restaurant/terrace-interior.jpg | Homepage | |
| images/restaurant/unknown-3.jpg |  | |
| images/restaurant/wedding-ceremony-beach.jpg | Homepage | |
| images/restaurant/wedding-table-flowers.jpg | Homepage | |
| images/restaurant/wedding-table-sea.jpg | Homepage | |
| images/food/baklava-tray.jpg | Homepage | |
| images/food/chicken-souvlaki.jpg | Homepage | |
| images/food/fish-with-rice.jpg |  | |
| images/food/galaktoboureko-tray.jpg | Homepage | |
| images/food/grilled-cheese-vegetables.jpg |  | |
| images/food/grilled-prawns.jpg | Homepage | |
| images/food/gyros-and-grilled-calamari.jpg | Homepage | |
| images/food/lamb-chops-kitchen-2.jpg |  | |
| images/food/lamb-chops-kitchen.jpg |  | |
| images/food/lamb-chops-table.jpg |  | |
| images/food/lamb-roast-potatoes.jpg | Homepage | |
| images/food/pistachio-cream-tray.jpg | Homepage | |
| images/food/red-mullet-plate.jpg | Homepage | |
| images/food/seafood-spaghetti.jpg | Homepage | |
| images/food/seafood-tray-langoustines.jpg | Homepage | |
| images/food/soutzoukakia-meatballs.jpg | Homepage | |
| images/food/the-grill-fresh-fish.jpg | Homepage | |
| images/food/three-grill-plates.jpg |  | |
| images/food/tomato-feta-meze.jpg | Homepage | |
| images/food/two-sea-bream-plated.jpg | Homepage | |
| images/food/whole-fish-grilled-veg-2.jpg | Homepage | |
| images/food/whole-fish-grilled-veg.jpg | Homepage | |
| images/heritage/bacchus_logo.png | Homepage | |
| images/heritage/chef-dimitris-fish.jpg | Homepage | |
| images/heritage/chef-dimitris-prawns.jpg |  | |
| images/heritage/chef-striped-apron-fish.jpg |  | |
| images/heritage/dimitris-big-fish-terrace.jpg | Homepage | |
| images/heritage/dimitris-swordfish.jpg |  | |
| images/heritage/dimitris-taverna-sign.jpg | Homepage | |
| images/heritage/dimitris-with-guest.jpg | Homepage | |
| images/heritage/grandfather-beach-boats.png | Homepage | |
| images/heritage/grandfather-lobster.png | Homepage | |
| images/heritage/grandfather-nets.png | Homepage | |
| images/heritage/lamb-on-the-spit-beach.jpg |  | |
| https://bacchus.gr/images/Food/17.JPG | Homepage · Yana section | Legacy 800×600 from old site — replace with original scan when available |

Heritage photos (`images/heritage/grandfather-*.png`) were cropped from album scans; re-scan at 600dpi for production.
Video: `images/restaurant/bacchus-drone.mp4` — hero on desktop only; start at 1.5s (`#t=1.5` + data-start), loop back to 1.5s; re-export trimmed & compressed (~2–3 MB, 1080p H.264) for production.
