# Greek copy — review notes

All UI strings live in `lib/i18n.ts` (`en` / `el`); content in `content/*.json` has `{ en, el }` fields; WhatsApp and email templates in `content/messages.json`.

## Corrections to the prototype's Greek

| Key | Prototype | Now | Why |
|---|---|---|---|
| `heroSub` | «τους ψαράδες **του Μεσογγή**» | «τους ψαράδες **της Μεσογγής**» | Μεσογγή is feminine → genitive «της Μεσογγής» |
| `heroSub` | «από την οικογένεια» | «από την οικογενειακή κουζίνα» | Matches EN "from the family kitchen" |
| `story1`, album caption | «**δίκτυα**» | «**δίχτυα**» | δίκτυα = networks; fishing nets = δίχτυα |
| `story1` | «έβγαινε … έβγαινε» | «ερχόταν από τα δίχτυα του» | Avoids the repeated verb |
| `h1a–c` | «Η Κέρκυρα / στο πιάτο, / δίπλα στη θάλασσα.» | «Μια γεύση / Κέρκυρας, / δίπλα στη θάλασσα.» | Literal to "A taste of Corfu"; «Η Κέρκυρα στο πιάτο» is already the menu label (03) |
| `explore` | «Ανακαλύψτε» | «Ανακαλύψτε τον Βάκχο» | Complete phrase, as in EN |
| `openLine` | «ΜΑΪΟΣ – ΟΚΤΩΒΡΙΟΣ» | «ΜΑΪΟ – ΟΚΤΩΒΡΙΟ» | Accusative after «ανοιχτά (από) … έως» |
| `hours` | «Ώρες» | «Ωράριο» | Standard label for opening hours |
| `yana2` | «Αν έχετε φάει εδώ ξανά» | «Αν έχετε ξαναφάει εδώ» | More natural |
| `eveBody` | «γενέθλια που τραβούν ως τα μεσάνυχτα» | «γενέθλια που κρατούν ως τα μεσάνυχτα» | «κρατούν» is the idiomatic verb |

Kept as-is (checked, correct): intro, story 2–3, Yana 1, catch, menu, wine, gallery, evenings headline, guests, find-us, footer sign-off «Τα λέμε δίπλα στη θάλασσα.».

## Newly translated (was English-only in the prototype)

- Booking form and summary (labels, placeholders, errors, request notes), the `/book` landing page, mobile bar, 404.
- Today's catch, six plate categories, gallery captions/alts, heritage album, all photo `alt` texts.
- WhatsApp request message (guest → Bacchus) in Greek when the site is in Greek.
- Owner reply templates (confirm / decline) and guest emails (received / confirmed / declined) in both languages; the guest's language is stored with the request so the owner gets the right template.
- Page titles / meta descriptions / Open Graph for `/el` and `/el/book`.

## Conventions

- Reviews stay in English (they are quotes) — the label reads «Επισκέπτης TripAdvisor».
- Names: Δημήτρης, Γιάννα. Brand in Greek: ΒΑΚΧΟΣ / Βάκχος; place: Μεσογγή.
- Uppercase Greek drops accents except the dialytika (ΜΑΪΟ).
- Greek headlines render in GFS Didot because Cormorant Garamond has no Greek glyphs.
