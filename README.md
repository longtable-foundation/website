# Longtable Foundation website

Static site, published with GitHub Pages. Built from the Claude Design mockups (direction 1a, build-out 2).

## Run locally

```sh
npm install
npm run dev        # builds to dist/ and serves on http://localhost:3000 (forms save to data/submissions.jsonl)
```

## Publish on GitHub Pages

The repo is public, so GitHub Pages is free. `.github/workflows/pages.yml` builds and publishes the site on each push to `main`.

1. Repo Settings → Pages → Source: **GitHub Actions**.
2. The site is then at `https://longtable-foundation.github.io/website/`.
3. Custom domain: add a repo variable `CUSTOM_DOMAIN` (Settings → Secrets and variables → Actions → Variables), for example `longtable.org`, then point the domain's DNS at GitHub Pages. The workflow writes the CNAME file and builds the site for the domain root.

## Sign-ups and the proposal (Google Sheet + Apps Script)

Two forms ask for work email and organization only: the sign-up on Get involved, and the proposal request (a dialog on every page, and the `/proposal/` page). Each one adds a row to the Google Sheet "Longtable newsletter capture database". A proposal request also emails the PDF.

**The proposal PDF is never in this repo or on the site.** It stays private in Google Drive. The Apps Script attaches it to the email.

Setup steps are at the top of `tools/google-sheet-capture.gs`. In short: paste the script into the sheet (Extensions → Apps Script), set the script property `PROPOSAL_FILE_ID`, deploy as a Web app (Execute as: Me, access: Anyone), and put the `/exec` URL in `src/config.js` → `sheetEndpoint` or the repo variable `SHEET_ENDPOINT`.

Until it is set, the forms show "Sign-ups open soon".

## Edit content

- `src/config.js`: YouTube video ids, press email, GitHub URL, signatories and logos, external links, 3D colour mode.
- `src/content.js`: use cases, roadmap, figures and other copy.
- `public/assets/`: press kit ZIP, logos, Open Graph image. Do not add the proposal PDF here.

## Structure

- `build.js` renders `src/pages/*` into `dist/`.
- `public/app.js` runs the interactive parts: 3D step-through explainers (`public/anim/`, three.js), sliders, accordion, forms, chapters.
- Loading states use [Skullet](https://skullet.lochie.me/) (vendored into `dist/vendor/skullet/` at build time).
- `server.js` is for local preview only: it serves `dist/` and takes form posts at `/api/submit`.
