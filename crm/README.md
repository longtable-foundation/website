# Longtable CRM

Next.js prospect pipeline for the Longtable Foundation. Built with the
[Fluid Functionalism](https://www.fluidfunctionalism.com) starter (Base UI
DataTable): sort, filter, search, and edit rows in place with undo/redo.

Seed data comes from Will and Arush’s
[Longtable Prospect Pipeline](https://docs.google.com/spreadsheets/d/1d9UsfLmbxO9_fDKW9bWZAnOVwVy5-3s66blgNuS_c-o/edit?gid=0#gid=0)
spreadsheet (65 prospects). Edits stay in the browser for now; email and Slack
ingestion are the next steps.

This app lives under `crm/` and is **not** part of the GitHub Pages static site
build.

## Run locally

```sh
cd crm
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Typecheck and build

```sh
cd crm
npm run typecheck
npm run build
```

## Stack

- Next.js (App Router) + React 19
- Fluid Functionalism DataTable (Base UI / TanStack Table)
- Tailwind CSS v4
- Seed module: `lib/prospects.ts`
