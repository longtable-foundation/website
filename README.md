# Longtable Foundation website

Static site, published with GitHub Pages. Built from the Claude Design mockups (direction 1a, build-out 2).

## Run locally

```sh
npm install
npm run dev        # builds to dist/ and serves on http://localhost:3000 (forms save to data/submissions.jsonl)
```

## Publish on GitHub Pages

`.github/workflows/pages.yml` builds and publishes the site on each push to `main`.

1. Repo Settings → Pages → Source: **GitHub Actions**.
2. The site is then at `https://longtable-foundation.github.io/website/`.
3. Custom domain: add a repo variable `CUSTOM_DOMAIN` (Settings → Secrets and variables → Actions → Variables), for example `longtable.org`, then point the domain's DNS at GitHub Pages. The workflow writes the CNAME file and builds the site for the domain root.

## Sign-up forms (Google Sheet)

The news, join and fund forms ask for work email and organization only. Each sign-up becomes a row in the Google Sheet "Longtable newsletter capture database" (columns: Timestamp, Work email, Organization, Interest, Page).

1. Open the sheet → Extensions → Apps Script. Paste `tools/google-sheet-capture.gs` and save.
2. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
3. Put the web app URL (ends in `/exec`) in `src/config.js` → `sheetEndpoint`, or in the repo variable `SHEET_ENDPOINT`.

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
