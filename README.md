# Longtable Foundation website

Static site, published with GitHub Pages. Built from the Claude Design mockups (direction 1a, build-out 2).

## Run locally

```sh
npm install
npm run dev        # serves on http://localhost:3000, rebuilds + reloads the browser on save (forms save to data/submissions.jsonl)
```

Or with [Bun](https://bun.sh) (`--bun` runs the scripts on Bun instead of Node):

```sh
bun install
bun --bun run dev
```

CI still uses npm, so `package-lock.json` is the lockfile of record (`bun.lock` is gitignored). After changing dependencies, run `npm install` too so the npm lockfile stays current.

## Publish on GitHub Pages

`.github/workflows/pages.yml` builds and publishes the site on each push to `main`. **While the site is a draft, every HTML page is AES-encrypted with [StatiCrypt](https://github.com/robinmoisson/staticrypt)** before deploy. Visitors see a password prompt; decryption happens in the browser.

1. Repo Settings → Secrets and variables → Actions → Secrets → add `STATICRYPT_PASSWORD` (the shared draft password).
2. Repo Settings → Pages → Source: **GitHub Actions**.
3. The site is then at `https://longtable-foundation.github.io/website/`.
4. Custom domain: add a repo variable `CUSTOM_DOMAIN` (Settings → Secrets and variables → Actions → Variables), for example `longtable.org`, then point the domain's DNS at GitHub Pages. The workflow writes the CNAME file and builds the site for the domain root.

Local unprotected preview stays `npm run build` / `npm run dev`. To preview the lock screen locally:

```sh
STATICRYPT_PASSWORD='your-draft-password' npm run build:protected
npm start
```

Commit `.staticrypt.json` (salt only, not the password) so “Remember me” and share links stay valid across deploys.

**Limits:** GitHub Pages has no real server-side auth. StatiCrypt encrypts the HTML; `app.js`, CSS, and assets under `public/` are still fetchable. The GitHub **repo** also still shows source unless you make it private. When you are ready to go fully public, remove the `protect` step from the workflow (or stop setting the secret and revert to `npm run build`).

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
