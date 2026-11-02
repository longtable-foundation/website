// Static site server and form endpoint for Railway.
//
// Env vars (all optional):
//   PORT                 set by Railway
//   DATABASE_URL         Postgres. If set, form submissions go to the "submissions" table.
//   DATA_DIR             Folder for submissions.jsonl when there is no database (mount a Railway volume here).
//   ADMIN_TOKEN          Enables GET /api/submissions.csv?token=... to export submissions.
//   NOTIFY_WEBHOOK_URL   Each submission is also POSTed here as JSON (Slack, Zapier, Make, etc.).

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.zip': 'application/zip', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
};

const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://i.ytimg.com; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'",
};

const REDIRECTS = { '/use-cases': '/use-cases/01/', '/use-cases/': '/use-cases/01/', '/proposal': '/assets/longtable-multimodal-clearing-proposal.pdf', '/github': 'https://github.com/longtable-foundation' };

/* ---------- storage ---------- */
let pool = null;
async function initDb() {
  if (!process.env.DATABASE_URL) { fs.mkdirSync(DATA_DIR, { recursive: true }); console.log(`[forms] no DATABASE_URL, writing to ${DATA_DIR}/submissions.jsonl`); return; }
  const { Pool } = require('pg');
  pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: /sslmode=disable|\.railway\.internal/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false } });
  await pool.query(`CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), type TEXT NOT NULL, email TEXT NOT NULL,
    organization TEXT, role TEXT, member_class TEXT, jurisdiction TEXT, message TEXT, page TEXT, user_agent TEXT)`);
  console.log('[forms] writing to Postgres table "submissions"');
}

async function save(rec) {
  if (pool) {
    await pool.query('INSERT INTO submissions (id,type,email,organization,role,member_class,jurisdiction,message,page,user_agent) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      [rec.id, rec.type, rec.email, rec.organization, rec.role, rec.memberClass, rec.jurisdiction, rec.message, rec.page, rec.userAgent]);
  } else {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.appendFileSync(path.join(DATA_DIR, 'submissions.jsonl'), JSON.stringify({ ...rec, createdAt: new Date().toISOString() }) + '\n');
  }
  if (process.env.NOTIFY_WEBHOOK_URL) {
    const text = `New Longtable ${rec.type} signup: ${rec.email}${rec.organization ? ' (' + rec.organization + ')' : ''}`;
    fetch(process.env.NOTIFY_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, ...rec }) })
      .catch(e => console.error('[forms] webhook failed:', e.message));
  }
}

async function listAll() {
  if (pool) return (await pool.query('SELECT * FROM submissions ORDER BY created_at DESC')).rows;
  const f = path.join(DATA_DIR, 'submissions.jsonl');
  if (!fs.existsSync(f)) return [];
  return fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)).reverse();
}

/* ---------- helpers ---------- */
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000, arr = (hits.get(ip) || []).filter(t => now - t < win);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > 10;
}
const json = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...SECURITY }); res.end(JSON.stringify(obj)); };
const clip = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
const csvCell = v => { let s = v == null ? '' : String(v instanceof Date ? v.toISOString() : v); if (/^[=+\-@]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };

function readBody(req, max = 20000) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > max) { reject(new Error('too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function handleSubmit(req, res) {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  if (limited(ip)) return json(res, 429, { error: 'Too many requests. Try again later.' });
  let d;
  try { d = JSON.parse(await readBody(req)); } catch { return json(res, 400, { error: 'Invalid request.' }); }
  if (d.website) return json(res, 200, { ok: true }); // honeypot
  const type = ['follow', 'join', 'fund'].includes(d.type) ? d.type : null;
  const email = clip(d.email, 254);
  if (!type) return json(res, 400, { error: 'Invalid form.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(res, 400, { error: 'Enter a valid work email.' });
  const rec = {
    id: crypto.randomUUID(), type, email, organization: clip(d.organization, 200), role: clip(d.role, 60),
    memberClass: clip(d.memberClass, 60), jurisdiction: clip(d.jurisdiction, 60), message: clip(d.message, 5000),
    page: clip(d.page, 200), userAgent: clip(req.headers['user-agent'], 300),
  };
  if (type !== 'follow' && !rec.organization) return json(res, 400, { error: 'Enter your organization.' });
  try { await save(rec); } catch (e) { console.error('[forms] save failed:', e); return json(res, 500, { error: 'Could not save. Try again later.' }); }
  console.log(`[forms] ${type} ${email.replace(/(.).*@/, '$1***@')}`);
  json(res, 200, { ok: true });
}

async function handleExport(req, res, url) {
  const tok = process.env.ADMIN_TOKEN, given = url.searchParams.get('token') || (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!tok || !given || given.length !== tok.length || !crypto.timingSafeEqual(Buffer.from(given), Buffer.from(tok))) return json(res, 404, { error: 'Not found' });
  const rows = await listAll();
  const cols = ['created_at', 'type', 'email', 'organization', 'role', 'member_class', 'jurisdiction', 'message', 'page'];
  const pick = (r, c) => r[c] ?? r[c.replace(/_([a-z])/g, (_, x) => x.toUpperCase())] ?? (c === 'created_at' ? r.createdAt : '');
  const csv = [cols.join(','), ...rows.map(r => cols.map(c => csvCell(pick(r, c))).join(','))].join('\n');
  res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="longtable-submissions.csv"', 'Cache-Control': 'no-store' });
  res.end(csv);
}

/* ---------- static ---------- */
function serveFile(req, res, file, code = 200) {
  const ext = path.extname(file).toLowerCase();
  const isHtml = ext === '.html';
  const headers = {
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': isHtml ? 'no-cache' : /\/anim\/lib\//.test(file) || /\/assets\//.test(file) ? 'public, max-age=604800' : 'public, max-age=3600',
    ...SECURITY,
  };
  fs.stat(file, (err, st) => {
    if (err) return notFound(req, res);
    headers['Content-Length'] = st.size;
    headers['Last-Modified'] = st.mtime.toUTCString();
    if (req.headers['if-modified-since'] && new Date(req.headers['if-modified-since']) >= new Date(st.mtime.toUTCString())) { res.writeHead(304, headers); return res.end(); }
    res.writeHead(code, headers);
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}
function notFound(req, res) { serveFile(req, res, path.join(ROOT, '404.html'), 404); }

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    let p = decodeURIComponent(url.pathname);

    if (p === '/api/submit' && req.method === 'POST') return handleSubmit(req, res);
    if (p === '/api/submissions.csv' && req.method === 'GET') return handleExport(req, res, url);
    if (p === '/healthz') return json(res, 200, { ok: true });
    if (p.startsWith('/api/')) return json(res, 404, { error: 'Not found' });
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end(); }

    if (REDIRECTS[p]) { res.writeHead(301, { Location: REDIRECTS[p] }); return res.end(); }
    const file = path.normalize(path.join(ROOT, p));
    if (!file.startsWith(ROOT)) return notFound(req, res);
    fs.stat(file, (err, st) => {
      if (!err && st.isFile()) return serveFile(req, res, file);
      if (!err && st.isDirectory()) {
        if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' + url.search }); return res.end(); }
        return serveFile(req, res, path.join(file, 'index.html'));
      }
      notFound(req, res);
    });
  } catch (e) {
    console.error(e); if (!res.headersSent) json(res, 500, { error: 'Server error' });
  }
});

initDb().catch(e => console.error('[forms] database init failed:', e.message)).finally(() => {
  server.listen(PORT, () => console.log(`Longtable site on :${PORT}`));
});
