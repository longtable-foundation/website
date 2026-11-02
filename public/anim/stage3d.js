import * as THREE from './lib/three.module.min.js';
import { EffectComposer } from './lib/EffectComposer.js';
import { RenderPass } from './lib/RenderPass.js';
import { UnrealBloomPass } from './lib/UnrealBloomPass.js';
import { OutputPass } from './lib/OutputPass.js';
import { makeKit } from './kit3d.js';

export const W = 1920, H = 1080;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const win = (t, a, b) => clamp((t - a) / (b - a));
const ease = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const fade = (t, a, b, f = .4) => clamp(Math.min((t - a) / f, (b - t) / f));
const hold = (t, a, z, fi = .3, fo = .5) => clamp(Math.min((t - a) / fi, 1 - (t - z) / fo));
const lerp3 = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
export const H3 = { clamp, win, ease, fade, hold, lerp3, C: { token: 0xF8D028, cash: 0x62D9A6, share: 0x7FB0EE, msg: 0xF2F0EA, dim: 0x5A5850 } };

export function createStage(host, labelHost, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(opts.pixelRatio ?? 1); renderer.setSize(W, H, false);
  Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);
  scene.fog = new THREE.FogExp2(0x050505, 0.009);
  const camera = new THREE.PerspectiveCamera(30, W / H, .1, 600);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), .85, .55, .18));
  composer.addPass(new OutputPass());
  const labels = [], kit = makeKit(THREE, scene, labelHost, labels);
  const v = new THREE.Vector3(), ct = new THREE.Vector3(), d = new THREE.Vector3();
  let def = null, t = 0, raf = 0, playing = false, stopAt = null, last = performance.now(), onTime = null, frameN = 0, shift = 0;
  const t0 = performance.now();

  function cam(time) {
    const k = def.camera; let i = 0;
    while (i < k.length - 1 && time >= k[i + 1].t) i++;
    if (i === 0) return { p: k[0].pos, g: k[0].target };
    const u = ease(win(time, k[i].t, k[i].t + (k[i].dur ?? 2.2)));
    return { p: lerp3(k[i - 1].pos, k[i].pos, u), g: lerp3(k[i - 1].target, k[i].target, u) };
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    const now = performance.now(), rt = (now - t0) / 1000, dtR = Math.min(.1, (now - last) / 1000);
    if (def && playing) { const end = Math.min(stopAt ?? def.duration, def.duration); t = Math.min(end, t + (now - last) / 1000); if (t >= end) playing = false; }
    last = now;
    if (def) {
      const c = cam(t);
      camera.position.set(c.p[0], c.p[1], c.p[2]).add(d.set(Math.sin(rt * .13) * .8, Math.sin(rt * .09) * .4, Math.cos(rt * .1) * .6));
      ct.set(c.g[0], c.g[1], c.g[2]); camera.lookAt(ct);
      camera.setViewOffset(W, H, 0, -shift, W, H);
      scene.fog.density = def.fog ? def.fog(t) : .009;
      def.update(t, rt);
      kit.tick(rt);
    }
    composer.render();
    const st = def && def.statement, bottomLim = st && t >= st.from && t < (st.to ?? 1e9) ? 820 : 1000;
    frameN++;
    let minTop = 1e9, maxBot = -1e9;
    for (const l of labels) {
      if (l.alpha < .01) { if (l.el.style.opacity !== '0') l.el.style.opacity = '0'; continue; }
      if (l.w == null || frameN % 30 === 0) { l.w = l.el.offsetWidth; l.h = l.el.offsetHeight; }
      v.copy(l.pos).project(camera);
      const sx = (v.x + 1) / 2 * W, sy = (1 - v.y) / 2 * H;
      const lf = l.anchor === 'left' ? sx : l.anchor === 'right' ? sx - l.w : sx - l.w / 2, rg = lf + l.w;
      const top = l.vmid ? sy - l.h / 2 : l.up ? sy - 12 - l.h : sy + 10, bot = top + l.h;
      if (l.alpha > .5 && v.z < 1) { if (top < minTop) minTop = top; if (bot > maxBot) maxBot = bot; }
      const m = v.z < 1 ? clamp((top - 270) / 30) * clamp((bottomLim - bot) / 30) * clamp((lf - 100) / 30) * clamp((1820 - rg) / 30) : 0;
      const al = l.alpha * m;
      if (al < .01) { if (l.el.style.opacity !== '0') l.el.style.opacity = '0'; continue; }
      l.el.style.opacity = al.toFixed(3);
      l.el.style.transform = `translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px) translate(${l.ax},${l.ay})`;
    }
    const want = minTop < 1e9 ? clamp(shift + Math.min(300 - minTop, bottomLim - 15 - maxBot), 0, 180) : 0;
    shift += (want - shift) * (1 - Math.exp(-dtR * 4));
    if (onTime) onTime(t, playing);
  }

  return {
    load(builder) { kit.clear(); def = builder(kit, H3); t = 0; playing = false; stopAt = null; return def; },
    playTo(end) { stopAt = end; playing = !!def && t < Math.min(end, def.duration); },
    pause() { playing = false; },
    seek(x) { t = clamp(x, 0, def ? def.duration : 0); },
    get t() { return t; },
    get playing() { return playing; },
    onTime(fn) { onTime = fn; },
    start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } },
    stop() { cancelAnimationFrame(raf); raf = 0; },
    get running() { return !!raf; },
    dispose() { cancelAnimationFrame(raf); raf = 0; kit.clear(); composer.dispose?.(); renderer.dispose(); renderer.domElement.remove(); },
  };
}
