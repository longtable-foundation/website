// GitHub Pages has no SPA fallback, so every route gets its own copy of index.html,
// with its title, canonical URL and Open Graph tags filled in. Run after `vite build`.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const data = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data.json'), 'utf8'))
const base = (process.env.BASE_PATH || '').replace(/\/$/, '')
const site = (process.env.SITE_URL || '').replace(/\/$/, '')
const SUFFIX = ' · Longtable Foundation'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const routes = [
  ['', 'Longtable Foundation · Multimodal clearing'],
  ['foundation', 'Foundation' + SUFFIX],
  ['roadmap', 'Roadmap' + SUFFIX],
  ['signatories', 'Signatories' + SUFFIX],
  ['press', 'Press' + SUFFIX],
  ['get-involved', 'Get involved' + SUFFIX],
  ['proposal', 'Proposal' + SUFFIX],
  ...data.UC.map((u) => [`use-cases/${u.slug}`, `Use case ${u.n}: ${u.t}${SUFFIX}`, u.d]),
]

const shell = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const description = shell.match(/<meta name="description" content="([^"]*)"/)[1]

const render = (route, title, desc = description) => {
  const url = site && `${site}/${route}${route ? '/' : ''}`
  const meta = [
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    site && `<meta property="og:image" content="${site}/assets/og.png" />`,
    url && `<link rel="canonical" href="${url}" />`,
    url && `<meta property="og:url" content="${url}" />`,
  ].filter(Boolean)
  return shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(desc)}"`)
    .replace('</head>', `    ${meta.join('\n    ')}\n  </head>`)
}

for (const [route, title, desc] of routes) {
  const file = path.join(dist, route, 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, render(route, title, desc))
}
fs.writeFileSync(path.join(dist, '404.html'), render('', 'Page not found' + SUFFIX))

const redirect = (to) =>
  `<!doctype html><meta charset="utf-8"><title>Redirecting</title><meta http-equiv="refresh" content="0; url=${base}${to}"><link rel="canonical" href="${base}${to}"><a href="${base}${to}">Continue</a>`
for (const [from, to] of [['use-cases', '/use-cases/01/'], ['about', '/foundation/']]) {
  fs.mkdirSync(path.join(dist, from), { recursive: true })
  fs.writeFileSync(path.join(dist, from, 'index.html'), redirect(to))
}
fs.writeFileSync(path.join(dist, '.nojekyll'), '')

console.log(`pages: wrote ${routes.length} routes, 404.html and 2 redirects to dist/`)
