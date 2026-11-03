// Renders the site to dist/. Run: node build.js
const fs = require('fs');
const path = require('path');
const { page } = require('./src/layout');
const C = require('./src/content');
const home = require('./src/pages/home');
const usecase = require('./src/pages/usecase');
const other = require('./src/pages/other');

const OUT = path.join(__dirname, 'dist');
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(__dirname, 'public'), OUT, { recursive: true });

// Vendor skullet (loading skeletons) from node_modules
const SK = path.join(__dirname, 'node_modules', 'skullet');
fs.mkdirSync(path.join(OUT, 'vendor', 'skullet'), { recursive: true });
for (const f of ['dist/index.mjs', 'dist/styles.css', 'LICENSE']) fs.copyFileSync(path.join(SK, f), path.join(OUT, 'vendor', 'skullet', path.basename(f)));

const cfg = require('./src/config');
const BASE = cfg.basePath;
const rebase = html => (BASE ? html.replace(/(href|src)="\/(?!\/)/g, `$1="${BASE}/`) : html);
const redirect = to => `<!doctype html><meta charset="utf-8"><title>Redirecting</title><meta http-equiv="refresh" content="0; url=${BASE}${to}"><link rel="canonical" href="${BASE}${to}"><a href="${BASE}${to}">Continue</a>`;

// `npm run dev` sets LIVE_RELOAD so pages pick up the reload client served by server.js.
const liveReload = html => (process.env.LIVE_RELOAD ? html.replace('</body>', '<script src="/__livereload.js"></script>\n</body>') : html);

const write = (route, p) => {
  const file = route === '404' ? path.join(OUT, '404.html') : path.join(OUT, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, liveReload(rebase(page({ path: route === '404' ? '/' : '/' + route + (route ? '/' : ''), ...p }))));
};

write('', { doc: 'LT-0001 · Multimodal Clearing · Draft for comment', docShort: 'LT-0001 · Draft', active: 'home', ...home() });
C.UC.forEach((u, i) => write(`use-cases/${u.slug}`, usecase(i)));
write('foundation', other.foundation());
write('roadmap', other.roadmap());
write('signatories', other.signatories());
write('press', other.press());
write('get-involved', other.getInvolved());
write('proposal', other.proposal());
write('404', other.notFound());

// Static redirects (the Node server also does these)
for (const [from, to] of [['use-cases', '/use-cases/01/'], ['about', '/foundation/']]) {
  fs.mkdirSync(path.join(OUT, from), { recursive: true });
  fs.writeFileSync(path.join(OUT, from, 'index.html'), redirect(to));
}
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

const n = fs.readdirSync(OUT, { recursive: true }).filter(f => f.endsWith('.html')).length;
console.log(`Built ${n} pages to dist/`);
