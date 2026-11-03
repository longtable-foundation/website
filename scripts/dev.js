// Dev server with live reload. Run: npm run dev (or bun --bun run dev)
//
// Builds dist/, starts server.js, then watches src/, public/ and build.js.
// On change it rebuilds in a fresh process (build.js relies on require(), so
// an in-process rebuild would serve stale modules) and tells open tabs to reload.
// Editing server.js restarts the server; tabs reload when they reconnect.
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const env = { ...process.env, LIVE_RELOAD: '1', FORM_ENDPOINT: process.env.FORM_ENDPOINT || '/api/submit' };
const run = file => spawnSync(process.execPath, [path.join(ROOT, file)], { env, stdio: 'inherit' }).status === 0;

let server;
const startServer = () => {
  server = spawn(process.execPath, [path.join(ROOT, 'server.js')], { env, stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });
};
const restartServer = () => {
  if (!server) return startServer();
  server.once('exit', startServer);
  server.kill();
};

let timer;
const pending = new Set();
const onChange = file => {
  pending.add(file);
  clearTimeout(timer);
  timer = setTimeout(() => {
    const files = [...pending];
    pending.clear();
    if (files.includes('server.js')) return restartServer();
    console.log(`[dev] ${files.join(', ')} changed, rebuilding`);
    if (run('build.js')) server?.send?.('reload');
    else console.log('[dev] build failed; fix the error and save again');
  }, 80);
};

const watch = (rel, recursive) =>
  fs.watch(path.join(ROOT, rel), { recursive }, (_, name) => onChange(recursive ? path.join(rel, name || '') : rel));

run('build.js'); // start serving even if the first build fails, so the watcher can recover
startServer();
watch('src', true);
watch('public', true);
watch('build.js', false);
watch('server.js', false);
console.log('[dev] watching src/, public/, build.js, server.js');

const stop = () => { server?.kill(); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
