# Rohtak Property Point — website

Static site. No build step, no npm, no framework. Plain HTML + CSS + vanilla JS.
Layout and behaviour modelled on the BABA Real Estate site (`../baba-realty`);
colours from the client's palette sheet (red / amber / off-white).

```
rohtak-property-point/
├── index.html              single scrolling page
├── serve.ps1               local preview server (port 4361)
├── .nojekyll
└── assets/
    ├── css/site.css        design system + all sections
    ├── js/config.js        ← THE FILE YOU EDIT: phone, WhatsApp, listings
    ├── js/site.js          behaviour (header, finder, listings, forms…)
    └── img/
        ├── logo-mark.svg   pin-and-house mark, red badge
        ├── favicon.svg
        └── listings/       6 illustrated placeholders — swap for real photos
```

## Palette

From the client's colour sheet (`hh.pdf`):

| Name      | Hex       | Used for                                           |
|-----------|-----------|----------------------------------------------------|
| Red       | `#ED1C24` | logo, pin, buttons, accents                        |
| Amber     | `#ECA72C` | lit windows, ticker, buttons on dark, highlights   |
| Off-white | `#FFFFFC` | page background, text on dark                      |

The sheet has no dark colour, so text and the night-time sections use deep
shades of the same red (`#5A090D`, `#2B0508`), and light sections use a tint
of the amber (`#FBEDD2`, `#FEF7E6`). Everything is a token at the top of
`assets/css/site.css`.

For contrast, small red text on light backgrounds uses `#C4121A` (6.0:1; brand
red is 4.3:1) and buttons with small off-white labels use `#D6151D` (5.2:1).
Brand red is kept for the logo, pin, large type and decoration.

## Before going live

1. **Confirm 81000 00736 is on WhatsApp.** Every WhatsApp button and both forms
   send to `918100000736`. If WhatsApp is on another number, change
   `whatsappNumber` in `assets/js/config.js`.
2. **Replace the sample listings.** The six listings in `config.js` are
   placeholders (sector, size and features are made up). Edit the `listings`
   array — add, remove or reorder freely. Drop real photos (4:3, jpg/webp) into
   `assets/img/listings/` and point `img` at them.
3. **Read the copy with the client.** Services and “Why us” wording describes
   how a broker usually works (documents checked, commission discussed up front,
   etc.). Confirm it matches how they actually operate.
4. Optional: paste a Formspree/Getform URL into `formEndpoint` to receive the
   callback form by email instead of WhatsApp.

## Facts taken from the Google Business Profile

Name (EN + हिंदी), 5.0 rating / 66 reviews, address (Shop 157, Market Sector
2 & 3, near Jaat Bhawan, Tilak Nagar, Sector 3, Rohtak 124001), hours (daily
8 AM – 8 PM) and the review quotes. If the review count grows, update the
three places it appears in `index.html` (hero chip, stats, reviews header).

## Local preview

```
powershell -ExecutionPolicy Bypass -File serve.ps1
```

then open http://localhost:4361/
