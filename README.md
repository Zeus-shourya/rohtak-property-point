# Rohtak Property Point — website

Static site (plain HTML + CSS + vanilla JS) with **Pages CMS**, so the client can
add properties, mark them sold and change their contact details themselves.
Live at **https://rohtakpropertypoint.com/** (GitHub Pages).

```
client clicks Save in app.pagescms.org
  → commit to main (content/listings/*.json, data/site.json, assets/img/posters/*)
  → GitHub Action (.github/workflows/deploy.yml)
       tools/build-data.ps1        content/listings/*.json → data/listings.json + sitemap.xml
       tools/optimize-images.mjs   shrinks big uploads, makes the small card previews
  → site republished (~1–2 minutes)
```

| Path | What it is |
|---|---|
| `index.html` | the single scrolling page |
| `admin.html` | client's bookmarkable "how to edit" page (English + Hindi), noindex |
| `.pages.yml` | what the client sees in the editor (two sections: Properties, Website settings) |
| `content/listings/*.json` | **one file per property**, edited in the CMS |
| `data/site.json` | **website settings** (phone, WhatsApp, hours, address, social links, headline, rating, reviews), edited in the CMS |
| `data/listings.json`, `sitemap.xml` | *generated* from `content/` on every deploy (git-ignored; `serve.ps1` builds them on request locally) |
| `assets/img/posters/` | property posters (`<name>.webp` + small `<name>_t.webp` card preview) |
| `assets/js/site.js` | behaviour; loads `data/site.json` and `data/listings.json` |
| `assets/js/config.js` | only the **fallback** settings, used if `data/site.json` cannot load |
| `tools/` | `build-data.ps1`, `optimize-images.mjs` |
| `.github/workflows/deploy.yml` | build + deploy on every push to `main` |
| `CNAME` | the custom domain, do not delete |

## One-time setup (connecting the editor)

1. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**
   (the custom domain is a separate Pages setting and is kept when the source changes).
2. Go to https://app.pagescms.org, sign in with GitHub, and add this repo
   (`Zeus-shourya/rohtak-property-point`, branch `main`); install the Pages CMS
   GitHub app on it when asked.
3. In Pages CMS, open the repo's **Collaborators** and invite the client's email.
   They do not need a GitHub account.
4. Give the client `https://rohtakpropertypoint.com/admin.html` (bookmark it).

## How a property is stored

`content/listings/<date>-<title>.json`, for example:

```json
{
  "title": "250 Yard Single-Storey House",
  "cat": "houses",
  "status": "For Sale",
  "location": "Sector 1, Rohtak",
  "sector": "Sector 1",
  "size": "250 yd (10 Marla) · North facing",
  "price": "₹3.35 Cr",
  "p": 335,
  "img": "/assets/img/posters/002-houses-sector-1.webp",
  "features": ["Green belt", "Near all amenities"],
  "ig": "DedlRFOzFpP",
  "date": "2026-10-14T10:36"
}
```

* `cat`: `plots | houses | floors | commercial | rent | other` (a filter button appears for each in use)
* `status`: `For Sale | For Rent | Sold | Rented | Hidden` (**Hidden** is dropped at build time)
* `sector` is optional: it defaults to the first part of `location`
* `p` (total price in lakh) is optional and only used for sorting; it is worked out from `price`
  when that reads like `₹3.35 Cr` / `₹52 lakh` (per-yard prices need it set)
* `img` is the poster. The card shows `<name>_t.webp` (made at deploy time; until it
  exists the full poster is used). Posters that are not square are shown whole on a matte.
* `ig` can be a post code or a full Instagram URL; `date` (IST) decides the order, newest first.

The 105 existing properties are the Instagram posters of 15 Sep – 14 Oct 2026
(details were read off each poster by eye, so spot-check anything that matters using
the property's "View original post" link). New properties added in the editor are
named from the date/time and the title.

## What the CMS can and cannot change

*Changes live:* properties (add, edit, mark sold, hide, delete), phone and the Call
buttons, WhatsApp number and opening message, office address and hours, Instagram /
Facebook / Google / directions links, the home-page headline and sub-headline, the
Google rating and review count, and the review cards.

*Not changed by the CMS:* the structured data and meta tags in `<head>` (JSON-LD
phone, address and hours, the meta description and social-card text) and the
service / "why us" copy. If the phone number or hours ever change, a developer
should also update those in `index.html`.

## Local preview

```
powershell -ExecutionPolicy Bypass -File serve.ps1
```

then open http://localhost:4361/. `data/listings.json` and `sitemap.xml` are rebuilt
from `content/` whenever they are requested, so edits show up on refresh. To build
them by hand: `powershell -File tools/build-data.ps1`.

## Palette

From the client's colour sheet (`hh.pdf`):

| Name      | Hex       | Used for                                           |
|-----------|-----------|----------------------------------------------------|
| Red       | `#ED1C24` | logo, pin, buttons, accents                        |
| Amber     | `#ECA72C` | lit windows, ticker, buttons on dark, highlights   |
| Off-white | `#FFFFFC` | page background, text on dark                      |

The sheet has no dark colour, so text and the darker sections use shades of the
same red (`--ink #44090E`, `--deep #6B0A10`, `--red-900 #8A0D13`), and light
sections use a tint of the amber (`#FDF4E1`, `#FFFAF0`). Everything is a token at
the top of `assets/css/site.css`. For contrast, small red text on light
backgrounds uses `#C4121A` (6.0:1; brand red is 4.3:1) and buttons with small
off-white labels use `#D6151D` (5.2:1).

## Custom domain: rohtakpropertypoint.com (live)

Served at **https://rohtakpropertypoint.com/** (HTTPS enforced; `www`, plain `http`
and the old `zeus-shourya.github.io` address redirect to it). The `CNAME` file holds
the domain. DNS lives in the owner's GoDaddy account (nameservers
`ns51/ns52.domaincontrol.com`):

| Type  | Name | Value                    |
|-------|------|--------------------------|
| A     | @    | 185.199.108.153          |
| A     | @    | 185.199.109.153          |
| A     | @    | 185.199.110.153          |
| A     | @    | 185.199.111.153          |
| CNAME | www  | zeus-shourya.github.io   |

Other records (name servers, SOA, `_domainconnect`, `_dmarc`) are GoDaddy defaults.
To use Search Console, verify `https://rohtakpropertypoint.com/` and submit `sitemap.xml`.

## Open items for the client

* Confirm **81000 00736 is on WhatsApp** (every WhatsApp button and both forms use it).
* The Google profile still says "Sector 3 (P)"; the shop is in **Sector 2**, so correct the profile.
* Read the services / "why us" copy once and confirm it matches how they work.
* Optional: paste a Formspree/Getform URL into `formEndpoint` in `assets/js/config.js`
  to get the callback form by email instead of WhatsApp.
