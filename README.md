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

## Sign-up forms (Google Forms)

The news, join and fund forms all post to one Google Form.

1. Make a Google Form with these short-answer questions (none required except Work email): Form, Work email, Organization, I am a, Member class, Jurisdiction, Message (paragraph), Page.
2. Get the entry ids: three dots → Get pre-filled link → type any text in every field → Get link. The link has `entry.123456=...` for each question.
3. In `src/config.js`, set `googleForm.action` to `https://docs.google.com/forms/d/e/<FORM_ID>/formResponse` (the id from the form's share link, the one with `/d/e/`) and each field's `entry.` id.
4. Responses arrive in the form's Responses tab. Link it to a Google Sheet to work with them.

Until `googleForm.action` is set, the forms show "Sign-ups open soon".

## Edit content

- `src/config.js`: YouTube video ids, press email, GitHub URL, signatories and logos, external links, 3D colour mode.
- `src/content.js`: use cases, roadmap, figures and other copy.
- `public/assets/`: proposal PDF, press kit ZIP, logos, Open Graph image.

## Structure

- `build.js` renders `src/pages/*` into `dist/`.
- `public/app.js` runs the interactive parts: 3D step-through explainers (`public/anim/`, three.js), sliders, accordion, forms, chapters.
- Loading states use [Skullet](https://skullet.lochie.me/) (vendored into `dist/vendor/skullet/` at build time).
- `server.js` is for local preview only: it serves `dist/` and takes form posts at `/api/submit`.
