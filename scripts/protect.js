#!/usr/bin/env node
// Encrypt every HTML file in dist/ with StatiCrypt so GitHub Pages stays gated.
// Requires STATICRYPT_PASSWORD (or SITE_PASSWORD) in the environment.
// Salt is pinned in .staticrypt.json so "Remember me" works across deploys.

'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const password = process.env.STATICRYPT_PASSWORD || process.env.SITE_PASSWORD || '';

if (!password) {
  console.error('protect: set STATICRYPT_PASSWORD (or SITE_PASSWORD) before encrypting.');
  process.exit(1);
}

if (!fs.existsSync(dist)) {
  console.error('protect: dist/ missing — run the site build first.');
  process.exit(1);
}

const countHtml = (dir) => {
  let n = 0;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) n += countHtml(p);
    else if (name.endsWith('.html')) n += 1;
  }
  return n;
};

const before = countHtml(dist);
if (!before) {
  console.error('protect: no HTML files found in dist/.');
  process.exit(1);
}

// staticrypt dist -r -d <tmpdir> writes <tmpdir>/dist/...
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'longtable-protect-'));
const args = [
  'staticrypt',
  'dist',
  '-r',
  '-d', tmp,
  '--short',
  '--remember', '14',
  '--template-title', 'Longtable Foundation',
  '--template-color-primary', '#111111',
  '--template-color-secondary', '#F6F6F5',
  '--template-button', 'Enter',
  '--template-instructions', 'Draft site — enter the shared password to continue.',
  '--template-placeholder', 'Password',
  '--template-error', 'Wrong password.',
  '--config', '.staticrypt.json',
];

const result = spawnSync('npx', args, {
  cwd: root,
  env: { ...process.env, STATICRYPT_PASSWORD: password },
  stdio: 'inherit',
});

if (result.status !== 0) {
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(result.status || 1);
}

const encryptedRoot = path.join(tmp, 'dist');
if (!fs.existsSync(encryptedRoot)) {
  console.error('protect: expected encrypted output at', encryptedRoot);
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(1);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.renameSync(encryptedRoot, dist);
fs.rmSync(tmp, { recursive: true, force: true });

const after = countHtml(dist);
const isEncrypted = (file) => fs.readFileSync(file, 'utf8').includes('staticrypt-html');
const walkCheck = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkCheck(p);
    else if (name.endsWith('.html') && !isEncrypted(p)) {
      throw new Error('protect: left unencrypted: ' + path.relative(root, p));
    }
  }
};
try {
  walkCheck(dist);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

console.log(`protect: encrypted ${after} HTML pages in dist/`);
