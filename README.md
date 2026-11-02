# Longtable Foundation website

Static site, hosted on DigitalOcean App Platform. Built from the Claude Design mockups (direction 1a, build-out 2).

## Run locally

```sh
npm install
npm run dev        # builds to dist/ and serves on http://localhost:3000 (forms save to data/submissions.jsonl)
```

## Publish on DigitalOcean

The site is a static build (`npm run build` writes `dist/`). It runs as a free App Platform static site. The spec is `.do/app.yaml`.

1. DigitalOcean → Apps → Create App → GitHub. Give the DigitalOcean GitHub app access to the `longtable-foundation` org, then pick `longtable-foundation/website`, branch `main`.
2. Set the component type to **Static Site**. Build command `npm ci && npm run build`. Output directory `dist`. Error document `404.html`.
3. Each push to `main` deploys again. The site gets a `*.ondigitalocean.app` URL. Add a custom domain under Settings → Domains.

With `doctl`: `doctl apps create --spec .do/app.yaml`.

## Sign-up forms (Google Sheet)

One sign-up form on the Get involved page asks for work email and organization only. Each sign-up becomes a row in the Google Sheet "Longtable newsletter capture database" (columns: Timestamp, Work email, Organization, Page).

1. Open the sheet → Extensions → Apps Script. Paste `tools/google-sheet-capture.gs` and save.
2. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
3. Put the web app URL (ends in `/exec`) in `src/config.js` → `sheetEndpoint`, or in the app's build-time variable `SHEET_ENDPOINT`.

Until it is set, the forms show "Sign-ups open soon".

## Edit content

- `src/config.js`: YouTube video ids, press email, GitHub URL, signatories and logos, external links, 3D colour mode.
- `src/content.js`: use cases, roadmap, figures and other copy.
- `public/assets/`: proposal PDF, press kit ZIP, logos, Open Graph image.

## Structure

- `build.js` renders `src/pages/*` into `dist/`.
- `public/app.js` runs the interactive parts: 3D step-through explainers (`public/anim/`, three.js), sliders, accordion, forms, chapters.
- Loading states use [Skullet](https://skullet.lochie.me/) (vendored into `dist/vendor/skullet/` at build time).
- `server.js` is for local preview only: it serves `dist/` and takes form posts at `/api/submit`.
