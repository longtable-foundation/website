# Longtable Foundation website

Static site with a small Node server for Railway. Built from the Claude Design mockups (direction 1a, build-out 2).

## Run locally

```sh
npm install
npm run dev        # builds to dist/ and serves on http://localhost:3000
```

## Deploy on Railway

1. New Project → Deploy from GitHub repo → pick this repo. `railway.json` sets the build (`npm run build`), the start command and a `/healthz` health check.
2. Forms (news, join, fund) need storage. Pick one:
   - Add a Postgres service and reference its `DATABASE_URL` in this service. Submissions go to the `submissions` table.
   - Or attach a volume at `/data` and set `DATA_DIR=/data`. Submissions go to `/data/submissions.jsonl`.
3. Set `ADMIN_TOKEN` to a long random string. Export submissions at `/api/submissions.csv?token=<ADMIN_TOKEN>`.
4. Optional: `NOTIFY_WEBHOOK_URL` (Slack, Zapier, Make) receives each submission as JSON. `SITE_URL` sets canonical and Open Graph URLs.
5. Settings → Networking → add your custom domain.

## Edit content

- `src/config.js`: YouTube video ids, press email, GitHub URL, signatories and logos, external links, 3D colour mode.
- `src/content.js`: use cases, roadmap, figures and other copy.
- `public/assets/`: proposal PDF, press kit ZIP, logos, Open Graph image.

## Structure

- `build.js` renders `src/pages/*` into `dist/`.
- `public/app.js` runs the interactive parts: 3D step-through explainers (`public/anim/`, three.js), sliders, accordion, forms, chapters.
- Loading states use [Skullet](https://skullet.lochie.me/) (vendored into `dist/vendor/skullet/` at build time).
- `server.js` serves `dist/` and handles `POST /api/submit`.
