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

const write = (route, p) => {
  const file = route === '404' ? path.join(OUT, '404.html') : path.join(OUT, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page({ path: route === '404' ? '/' : '/' + route + (route ? '/' : ''), ...p }));
};

write('', { doc: 'LT-0001 · Multimodal Clearing · Draft for comment', docShort: 'LT-0001 · Draft', active: 'home', ...home() });
C.UC.forEach((u, i) => write(`use-cases/${u.slug}`, usecase(i)));
write('signatories', other.signatories());
write('about', other.about());
write('press', other.press());
write('get-involved', other.getInvolved());
write('404', other.notFound());

const n = fs.readdirSync(OUT, { recursive: true }).filter(f => f.endsWith('.html')).length;
console.log(`Built ${n} pages to dist/`);
