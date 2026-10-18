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
    ├── js/config.js        ← THE FILE YOU EDIT: phone, WhatsApp, Instagram, listings
    ├── js/site.js          behaviour (header, finder, listings, forms…)
    └── img/
        ├── logo-mark.svg   pin-and-house mark, red badge
        ├── favicon.svg
        ├── hero-building.jpg  the office at night (hero background)
        └── posters/        105 property posters from Instagram (full + _t thumbnail)
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
2. **Keep the listings current.** The 105 listings come from the Instagram
   posters of 15 Sep - 14 Oct 2026. Each poster's details (sector, size, price,
   facing) were read off the image by eye, so spot-check any that matter -
   each property pop-up has a "View original post" link. To add a property:
   save the poster (~960px wide .webp) in `assets/img/posters/` plus a ~480px
   copy named `<same name>_t.webp`, copy a block in the `listings` array of
   `config.js` (the field guide is above it) and put it at the top. Mark a
   property sold with `status: 'Sold'`.
3. **Read the copy with the client.** Services and “Why us” wording describes
   how a broker usually works (documents checked, commission discussed up front,
   etc.). Confirm it matches how they actually operate.
4. Optional: paste a Formspree/Getform URL into `formEndpoint` to receive the
   callback form by email instead of WhatsApp.

## Facts taken from the Google Business Profile

Name (EN + हिंदी), 5.0 rating / 66 reviews, address (Shop 157, Market Sector
2, near Jaat Bhawan, Tilak Nagar, Rohtak 124001), hours (daily 8 AM – 8 PM)
and the review quotes. Note: the Google listing itself says "Sector 3 (P)";
the owner confirmed the shop is in **Sector 2**, so the site says Sector 2
everywhere — worth correcting the Google profile to match. If the review count
grows, update the three places it appears in `index.html` (hero chip, stats,
reviews header).

## Local preview

```
powershell -ExecutionPolicy Bypass -File serve.ps1
```

then open http://localhost:4361/

## Instagram

The 105 listings are the property posters on https://www.instagram.com/rohtakpropertypoint/
posted 15 Sep - 14 Oct 2026 (the account had 448 posts in that window, but most
are the same poster re-posted or re-designed; they were grouped by picture and by
content, leaving 105 distinct properties plus a few generic dealer ads that were
left out). Prices are the "Demand" figure printed on each poster. The posters
also advertise `rohtakpropertypoint.com`; if the client owns that domain, point it
at this site (add a `CNAME` file and set the custom domain in the repo's Pages
settings).

## Custom domain: rohtakpropertypoint.com

The site's own addresses (canonical, social cards, structured data, sitemap,
robots.txt) and the `CNAME` file are switched to `https://rohtakpropertypoint.com/`
on the `custom-domain` branch. Merge it into `main` only once DNS points at
GitHub, because as soon as a custom domain is set the old `github.io` address
redirects to it.

**1. DNS (GoDaddy, nameservers `ns51/ns52.domaincontrol.com`)**

| Type  | Name | Value                    |
|-------|------|--------------------------|
| A     | @    | 185.199.108.153          |
| A     | @    | 185.199.109.153          |
| A     | @    | 185.199.110.153          |
| A     | @    | 185.199.111.153          |
| CNAME | www  | zeus-shourya.github.io   |

Replace the existing "Parked" `A @` record (it points at GoDaddy's parking page,
`3.33.130.190`) and the `www` CNAME that points at `@`. Turn off any GoDaddy
domain forwarding for the domain.

**2. Switch the site over** (after the A records resolve to the four GitHub
addresses): merge `custom-domain` into `main` and push; set the Pages custom
domain to `rohtakpropertypoint.com` (repo Settings > Pages, or
`PUT /repos/Zeus-shourya/rohtak-property-point/pages` with `{"cname": ...}`);
wait for GitHub to issue the HTTPS certificate (minutes to an hour); then tick
"Enforce HTTPS". Update the base URL for this site in `D:\E-BOOK\.claude\seo-check.ps1`.
