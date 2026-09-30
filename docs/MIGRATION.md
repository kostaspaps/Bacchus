# Go-live runbook — replacing the old server IP (IP.gr → Vercel)

> ✅ **Done 2026-09-30 22:13 UTC.** DNS is edited in the hosting plan's **cPanel Zone Editor** (https://ns311.ipdns.gr:2083, user `bacc8274`), not in the IP.gr domain "DNS control" page (that page only offers templates; its *Activate* button would replace the zone — do not use it). Applied: `mail` CNAME → A `49.12.120.147`; MX → `10 mail.bacchus.gr.`; SPF without `+a`; root A → `76.76.21.21` (TTL 300); `www` CNAME left pointing at the root. Vercel: both domains verified, root 308-redirects to www.

**Current state (checked 2026-09-30):**

| Record | Value | Meaning |
|---|---|---|
| `bacchus.gr` A | `49.12.120.147` | Old Apache/PHP site |
| `www.bacchus.gr` CNAME | `bacchus.gr.` | Follows whatever `bacchus.gr` points to |
| `bacchus.gr` MX | `0 bacchus.gr.` | **Mail is delivered to the same IP as the website** |
| `mail.bacchus.gr` CNAME | `bacchus.gr.` | **Also follows `bacchus.gr` — must become an A record before the switch** |
| TXT (SPF) | `v=spf1 ip4:49.12.120.147 ip4:142.132.254.13 +a +mx +ip4:195.201.241.83 ~all` | |
| Nameservers | `ns133.ipdns.gr`, `ns134.ipdns.gr` | DNS is managed in the IP.gr control panel |

> ⚠️ **Do not simply change the A record.** Because the MX record points at `bacchus.gr` itself, moving the A record to Vercel would send `info@bacchus.gr` mail to Vercel and it would bounce. Steps 3–4 below fix the mail records *before* the switch.

A copy of the old site is in `docs/legacy/bacchus-legacy-site-2026-09-30.zip` (pages, CSS, JS, 45 photos).

## 0. Before you start

- [ ] Vercel project deployed and green (`pnpm build` passes; see README).
- [ ] Env vars set in Vercel (DATABASE_URL via Neon, ADMIN_PASSWORD, Resend/SMTP, GTM). `NEXT_PUBLIC_SITE_URL`, phone, WhatsApp, OWNER_EMAIL, FROM_EMAIL are already set.
- [ ] Reservations table created; test a booking on the Vercel preview URL and confirm the owner email arrives.
- [x] Domains `www.bacchus.gr` (primary) and `bacchus.gr` are attached to the Vercel project. Vercel asks for `A www.bacchus.gr 76.76.21.21`; the apex redirects to www once configured.

## 1. Export the old site (fallback)

Done — `docs/legacy/bacchus-legacy-site-2026-09-30.zip`. Keep the IP.gr hosting active for at least 30 days after the switch.

## 2. Lower the TTL (optional but recommended, 24 h before)

In IP.gr DNS, set TTL of the `bacchus.gr` and `www` A records to 300 s so the switch propagates fast.

## 3. Separate mail from web (IP.gr DNS panel)

1. `mail.bacchus.gr` is currently a **CNAME to `bacchus.gr`**. Delete that CNAME and create an **A record** `mail.bacchus.gr → 49.12.120.147`. (If IP.gr's mail server has a different hostname, use that instead.) Without this, mail would follow the web switch to Vercel.
2. Change **MX**: `bacchus.gr  MX 10 mail.bacchus.gr.` (replace the `0 bacchus.gr.` entry).
3. Update **SPF** TXT: remove `+a` (it would start pointing at Vercel), keep the IPs:
   `v=spf1 ip4:49.12.120.147 ip4:142.132.254.13 +mx ip4:195.201.241.83 ~all`
4. Check any mail clients (Yana's phone/laptop) use `mail.bacchus.gr` as IMAP/SMTP server, not `bacchus.gr`. If they use `bacchus.gr`, change them now — after step 5 that name will be Vercel.
5. Send a test email to `info@bacchus.gr` from outside and confirm it arrives.

## 4. Email sending for the website (Resend)

> ✅ Done 2026-09-30: domain `bacchus.gr` verified on Resend (EU region, sending only; receiving OFF so the MX stays on IP.gr). Records `resend._domainkey` TXT, `rsend`/`send` CNAMEs, `_dmarc` TXT added in cPanel. `RESEND_API_KEY`, `FROM_EMAIL=bookings@bacchus.gr`, `OWNER_EMAIL=bacchusrestaurantgr@gmail.com` set on Vercel. Test booking delivered both emails.

1. resend.com → Domains → Add `bacchus.gr`.
2. Add the 3 records Resend shows (DKIM TXT `resend._domainkey`, SPF for `send.bacchus.gr` MX + TXT) in IP.gr DNS. These are on a subdomain and do **not** conflict with the mailbox.
3. Wait for "Verified", then set `RESEND_API_KEY` and `FROM_EMAIL=bookings@bacchus.gr` in Vercel.

## 5. Point the website at Vercel

In IP.gr DNS:

| Record | Change to |
|---|---|
| `www.bacchus.gr` | Either keep the CNAME → `bacchus.gr.` (it will follow), or replace it with CNAME → `cname.vercel-dns.com.` — primary host |
| `bacchus.gr` A | `76.76.21.21` (delete the old A record) — Vercel redirects it to www |
| `mail.bacchus.gr` A | **leave** `49.12.120.147` (created in step 3) |
| MX / SPF / DKIM | **leave** as set in steps 3–4 |

Vercel issues the TLS certificate automatically once DNS resolves (a few minutes to ~1 h).

Verify:

```bash
dig +short www.bacchus.gr A      # → 76.76.21.21
dig +short bacchus.gr A          # → 76.76.21.21
dig +short bacchus.gr MX         # → 10 mail.bacchus.gr.
curl -sI https://www.bacchus.gr | head -3        # HTTP/2 200, server: Vercel
curl -sI https://bacchus.gr | head -1            # 308 → https://www.bacchus.gr
curl -sI https://www.bacchus.gr/index.php | head -1 # 308 → /
curl -s https://www.bacchus.gr/llms.txt | head -2
```

Send one more test email to `info@bacchus.gr`.

## 6. After the switch

- [ ] Google Search Console: add property `https://bacchus.gr` (DNS TXT verification at IP.gr), submit `https://bacchus.gr/sitemap.xml`, request indexing for `/` and `/book`.
- [ ] Google Business Profile: website `https://bacchus.gr`, menu `https://bacchus.gr/#menu`, reservations `https://bacchus.gr/book?utm_source=google&utm_medium=gbp`.
- [ ] Google Ads: final URL `https://bacchus.gr/book`, auto-tagging ON, conversions from GTM events `submit_booking` and `whatsapp_booking_click`.
- [ ] TripAdvisor / Facebook / Instagram: update the website link.
- [ ] Lighthouse on the live URL (mobile): perf > 90, a11y > 95, SEO > 95.
- [ ] Book a test table on mobile end-to-end: form → WhatsApp opens with the prefilled text → owner email → `/admin` shows the request → confirm → guest email.
- [ ] After 30 days with no issues, cancel the IP.gr web hosting (keep the domain + mailbox / DNS).

## Rollback

Set `www.bacchus.gr` A and `bacchus.gr` A back to `49.12.120.147` at IP.gr. Mail is unaffected because it now uses `mail.bacchus.gr`.
