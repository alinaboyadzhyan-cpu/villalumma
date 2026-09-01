# Villa Lumma — one-page property site

A one-page landing site for Villa Lumma (Finestrat Golf Estates, Costa Blanca), built from the client's PDF catalog: overview, interactive floor-plan viewer, photo gallery, location, investment case, brochure download and an enquiry form.

## Files

```
index.html              main page
styles.css               all styling
i18n.js                    translations (EN/FR/IT/NL/SV/NO) + language auto-detect & switcher
script.js                 nav, floor-plan switcher, gallery filter, form
images/                    23 photos + 3 floor plan sheets, optimized for web
assets/villa-lumma-brochure.pdf   downloadable brochure (same as the source catalog)
```

## Languages

The site auto-detects the visitor's browser language and displays English, Spanish, French, German, Dutch, Swedish or Polish — with a manual switcher (top right of the nav, and inside the mobile menu) to override it. If the browser language isn't one of these seven, it defaults to English.

Notes:
- The choice made via the switcher only applies for the current page load — it isn't saved between visits (no cookies/localStorage are used).
- The Spanish plan names (Sótano / Planta Baja / Planta Alta) are kept as-is in every language, matching the architect's original drawings.
- To edit any translation, open `i18n.js` and find the `translations` object — each language is a flat list of `"key": "text"` pairs, all under the same keys as English.
- To add a language: duplicate one language block inside `translations`, translate the values, then add its code to the `SUPPORTED_LANGS` array and its name to `LANG_NAMES` near the top of the file.

## Before you publish

1. **Contact details are live**: +34 685 652 209 · vl@lummacapital.com (already wired into the header, contact card, and form-error fallback).
2. **Enquiry form is connected to Formspree** (`https://formspree.io/f/moeqedjg`) and sends straight to the email used to create that Formspree account. If you ever need to change the destination inbox or reset the endpoint, do it from your Formspree dashboard — no code change needed unless you swap to a different endpoint entirely (search `formspree.io/f/` in `index.html`).
3. **Swap the brochure PDF** in `assets/` if pricing or floor plans change — keep the filename or update the two download links in `index.html`.

## Deploying to GitHub Pages

1. Create a new repository and push these files to the root (or to a `/docs` folder).
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", choose **Deploy from a branch**, pick `main` (or your branch) and `/ (root)` — or `/docs` if you used that folder.
4. Save. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

No build step is required — it's plain HTML/CSS/JS.
