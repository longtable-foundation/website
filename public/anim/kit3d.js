export function makeKit(THREE, scene, labelHost, labels) {
  let root = new THREE.Group(); scene.add(root);
  let ticks = [];
  const ADD = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending };
  const tex = (draw, w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const glowTex = tex((g, w) => { const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.14, 'rgba(255,255,255,.6)'); r.addColorStop(.42, 'rgba(255,255,255,.12)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, w, w); }, 128, 128);
  const gridTex = tex((g, w) => { g.strokeStyle = '#fff'; for (let i = 0; i <= 24; i++) { const p = Math.round(i * (w - 4) / 24) + 2; g.globalAlpha = i % 4 === 0 ? .9 : .28; g.lineWidth = i % 4 === 0 ? 3 : 2; g.beginPath(); g.moveTo(p, 0); g.lineTo(p, w); g.moveTo(0, p); g.lineTo(w, p); g.stroke(); } g.globalAlpha = 1; g.globalCompositeOperation = 'destination-in'; const r = g.createRadialGradient(w / 2, w / 2, w * .05, w / 2, w / 2, w * .7); r.addColorStop(0, '#000'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, w, w); }, 1024, 1024);
  const beamTex = tex((g, w, h) => { const r = g.createLinearGradient(0, 0, 0, h); r.addColorStop(0, 'rgba(255,255,255,0)'); r.addColorStop(.3, 'rgba(255,255,255,.9)'); r.addColorStop(.7, 'rgba(255,255,255,.9)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); }, 4, 256);
  const V = p => (p.isVector3 ? p.clone() : new THREE.Vector3(p[0], p[1], p[2]));
  const glow = (color, s, op = 0) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, ...ADD, opacity: op })); sp.scale.set(s, s, 1); return sp; };
  const lineMat = (color, op = 1) => new THREE.LineBasicMaterial({ color, transparent: true, opacity: op });

  function label(pos, text, sub, o = {}) {
    const el = document.createElement('div'), bare = !!o.bare;
    Object.assign(el.style, { position: 'absolute', left: '0', top: '0', opacity: '0', whiteSpace: 'nowrap', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: bare ? '0' : '10px 20px', borderRadius: '12px', background: bare ? 'none' : 'rgba(7,7,6,.84)', border: bare ? 'none' : '1px solid rgba(242,240,234,.14)', willChange: 'transform,opacity' });
    const html = (t, s) => (t ? `<div style="font:600 ${o.size || 36}px 'Hanken Grotesk',sans-serif;color:#F2F0EA;letter-spacing:-.01em">${t}</div>` : '') + (s ? `<div style="font:500 ${o.subSize || 28}px 'IBM Plex Mono',monospace;letter-spacing:.08em;color:${o.subColor || '#F2F0EA'}">${s}</div>` : '');
    el.innerHTML = html(text, sub);
    labelHost.appendChild(el);
    const ay = o.ay || 'calc(-100% - 12px)';
    const l = { el, pos: V(pos), alpha: 0, ax: o.ax || '-50%', ay, up: ay.startsWith('calc(-100%'), vmid: ay === '-50%', anchor: o.ax === '0%' ? 'left' : o.ax === '-100%' ? 'right' : 'center', text, sub,
      set(t, s = l.sub) { if (t !== l.text || s !== l.sub) { l.text = t; l.sub = s; l.w = null; el.innerHTML = html(t, s); } } };
    labels.push(l); return l;
  }
  const note = (pos, text, o = {}) => label(pos, null, text, { bare: true, ...o });

  function plane(o) {
    const x = o.x || 0, z = o.z || 0;
    const g = new THREE.Group(); g.position.set(x, o.y, z);
    const geo = new THREE.BoxGeometry(o.w, .06, o.d);
    const slab = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0 }));
    const grid = new THREE.Mesh(new THREE.PlaneGeometry(o.w, o.d), new THREE.MeshBasicMaterial({ map: gridTex, color: o.color, ...ADD, opacity: 0 }));
    grid.rotation.x = -Math.PI / 2; grid.position.y = .04;
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), lineMat(o.color, 0));
    const under = glow(o.color, Math.max(o.w, o.d) * 1.1); under.position.y = -.4;
    g.add(slab, grid, edges, under); root.add(g);
    const lab = o.label ? note([x - o.w / 2 + o.w * (o.labelAt ?? .14), o.y, z + o.d / 2], o.label, { ax: '0%', ay: '12px', subColor: o.labelColor || '#F2F0EA' }) : null;
    return { g, lab, set(a = 1, gl = a) { g.visible = a > .005; slab.material.opacity = .88 * a; grid.material.opacity = .13 * gl * a; edges.material.opacity = (.2 + .8 * gl) * a; under.material.opacity = .05 * gl * a; if (lab) lab.alpha = a; } };
  }

  function node(o) {
    const w = o.w || 2.4, d = o.d || 2.4, h = o.h || .34, color = o.color ?? 0xF2F0EA;
    const g = new THREE.Group(); g.position.copy(V(o.pos));
    const geo = new THREE.BoxGeometry(w, h, d);
    const body = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x121211, transparent: true, opacity: 0 }));
    body.position.y = h / 2;
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo), lineMat(color, 0)); edge.position.y = h / 2;
    const halo = glow(color, Math.max(w, d) * 2.2); halo.position.y = h;
    g.add(body, edge, halo); root.add(g);
    const lab = o.label ? label([o.pos[0], o.pos[1] + h + .25, o.pos[2] - d * .2], o.label, null, o.lab || {}) : null;
    const col = new THREE.Color(color);
    return { g, lab, set(a = 1, gl = 0, c) { if (c != null) { edge.material.color.set(c); halo.material.color.set(c); } else { edge.material.color.copy(col); halo.material.color.copy(col); } g.visible = a > .005; body.material.opacity = .96 * a; edge.material.opacity = (.4 + .6 * Math.min(1, gl)) * a; halo.material.opacity = .5 * Math.min(1.4, gl) * a; if (lab) lab.alpha = a; } };
  }

  function flow(a, b, o = {}) {
    const A = V(a), B = V(b), M = A.clone().lerp(B, .5); M.y += o.lift ?? 1.4;
    const curve = new THREE.QuadraticBezierCurve3(A, M, B), color = o.color ?? 0xF2F0EA;
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, o.r ?? .03, 6, false), new THREE.MeshBasicMaterial({ color, ...ADD, opacity: 0 }));
    root.add(tube);
    const comets = [], N = 14, P = new THREE.Vector3();
    const mk = () => { const s = []; for (let i = 0; i < N; i++) { const sp = glow(color, 1); root.add(sp); s.push(sp); } comets.push(s); };
    return {
      curve,
      route(al) { tube.material.opacity = al * .3; tube.visible = al > .005; },
      heads(us, al = 1, size = 1) {
        while (comets.length < us.length) mk();
        comets.forEach((s, k) => { const u = us[k]; s.forEach((sp, i) => { const uu = u == null ? -1 : u - i * .011; if (u == null || u > 1.001 || uu < 0) { sp.material.opacity = 0; sp.visible = false; return; } sp.visible = true; curve.getPoint(Math.min(uu, 1), P); sp.position.copy(P); const f = 1 - i / N; sp.scale.setScalar((i === 0 ? 1.25 : .7 * f + .12) * size); sp.material.opacity = al * (i === 0 ? 1 : f * .65); }); });
      },
    };
  }

  function beam(a, b, o = {}) {
    const A = V(a), B = V(b), len = A.distanceTo(B), color = o.color ?? 0xF8D028, r = o.r ?? .34;
    const g = new THREE.Group(); g.position.copy(A);
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
    const outer = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 32, 1, true), new THREE.MeshBasicMaterial({ map: beamTex, color, ...ADD, opacity: 0, side: THREE.DoubleSide }));
    const core = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1, 10, 1, true), new THREE.MeshBasicMaterial({ map: beamTex, color, ...ADD, opacity: 0 }));
    g.add(outer, core); root.add(g);
    const ring = new THREE.Mesh(new THREE.RingGeometry(.92, 1, 72), new THREE.MeshBasicMaterial({ color, ...ADD, opacity: 0, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.position.copy(B); ring.position.y += .05; root.add(ring);
    return {
      set(head, al = 1, tail = 0) { const h = Math.max(.001, head - tail) * len; [outer, core].forEach(m => { m.scale.y = h; m.position.y = tail * len + h / 2; }); g.visible = al > .005; outer.material.opacity = al * .45; core.material.opacity = al; },
      hit(p) { ring.material.opacity = p > 0 && p < 1 ? (1 - p) : 0; ring.scale.setScalar(.5 + p * 2.6); },
    };
  }

  function ring(pos, o = {}) {
    const color = o.color ?? 0xF8D028, rx = o.rx ?? o.r ?? 2, rz = o.rz ?? o.r ?? 2;
    const g = new THREE.Group(); g.position.copy(V(pos)); root.add(g);
    class Ell extends THREE.Curve { getPoint(u, out = new THREE.Vector3()) { const a = u * Math.PI * 2; return out.set(Math.cos(a) * rx, 0, Math.sin(a) * rz); } }
    const curve = new Ell();
    const thin = new THREE.Mesh(new THREE.TubeGeometry(curve, 200, .04, 6, true), new THREE.MeshBasicMaterial({ color, ...ADD, opacity: 0 }));
    const wide = new THREE.Mesh(new THREE.TubeGeometry(curve, 200, .14, 6, true), new THREE.MeshBasicMaterial({ color, ...ADD, opacity: 0 }));
    const halo = glow(color, Math.max(rx, rz) * 2.4);
    g.add(thin, wide, halo);
    const R = 3, N = 16, runners = [], P = new THREE.Vector3(), per = Math.PI * (rx + rz);
    for (let k = 0; k < R; k++) for (let i = 0; i < N; i++) { const sp = glow(color, 1); g.add(sp); runners.push({ sp, k, i }); }
    const dz = o.back ? -rz * 1.08 : rz * 1.08, lx = o.labelDx || 0;
    const lab = o.label ? note([pos[0] + lx, pos[1], pos[2] + dz], o.label, { ay: o.back ? 'calc(-100% - 10px)' : '10px', subColor: '#F8D028' }) : null;
    return {
      g, lab,
      set(a, rt = 0) {
        g.visible = a > .005; thin.material.opacity = a * .9; wide.material.opacity = a * .16; halo.material.opacity = a * .07;
        runners.forEach(r => { const u = (((rt * 8) / per + r.k / R - r.i * (.55 / per)) % 1 + 1) % 1; curve.getPoint(u, P); r.sp.position.copy(P); const f = 1 - r.i / N; r.sp.scale.setScalar(r.i === 0 ? 1 : .6 * f + .12); r.sp.material.opacity = a * (r.i === 0 ? 1 : f * .7); });
        if (lab) lab.alpha = a;
      },
      move(p, s = 1) { g.position.copy(V(p)); g.scale.setScalar(s); if (lab) lab.pos.set(p[0] + lx * s, p[1], p[2] + dz * s); },
    };
  }

  const SHAPES = { token: () => new THREE.CylinderGeometry(.8, .8, .34, 6), cash: () => new THREE.CylinderGeometry(.74, .74, .24, 40), share: () => new THREE.BoxGeometry(1.5, .46, 1.05), voucher: () => new THREE.BoxGeometry(1.3, .08, .86) };
  function block(color, shape = 'token', o = {}) {
    const geo = (SHAPES[shape] || SHAPES.token)();
    const g = new THREE.Group(), inner = new THREE.Group(); g.add(inner);
    const fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(.32), transparent: true, opacity: 0 }));
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), lineMat(color, 0));
    const halo = glow(color, o.halo ?? 2.6);
    inner.add(fill, edge); g.add(halo); root.add(g);
    const ph = Math.random() * 6.28;
    if (o.spin ?? shape === 'token') ticks.push(rt => { inner.rotation.y = rt * .6 + ph; });
    return { g, set(p, a = 1, hollow = 0, boost = 0) { if (p) g.position.copy(V(p)); g.visible = a > .01; fill.material.opacity = a * .92 * (1 - hollow); edge.material.opacity = a; halo.material.opacity = a * (.26 + .5 * boost) * (1 - .7 * hollow); } };
  }

  function frame(c, w, d, o = {}) {
    const hw = w / 2, hd = d / 2, y = c[1] + .06;
    const pts = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd], [-hw, -hd]].map(p => new THREE.Vector3(c[0] + p[0], y, c[2] + p[1]));
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: o.color ?? 0xF8D028, dashSize: .6, gapSize: .35, transparent: true, opacity: 0 }));
    line.computeLineDistances(); root.add(line);
    return { set(a) { line.visible = a > .005; line.material.opacity = a; } };
  }

  function tile(o) {
    const g = new THREE.Group(); g.position.set(o.x, o.y || 0, o.z); root.add(g);
    const w = o.w, d = o.d, pz = o.padZ || 0, pw = o.padW || 4.4, mats = [];
    const M = (m, k) => (mats.push([m, k]), m);
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w, .06, d), M(new THREE.MeshBasicMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0 }), .88));
    const grid = new THREE.Mesh(new THREE.PlaneGeometry(w, d), M(new THREE.MeshBasicMaterial({ map: gridTex, color: o.color ?? 0xF2F0EA, ...ADD, opacity: 0 }), .12));
    grid.rotation.x = -Math.PI / 2; grid.position.y = .04;
    const pts = [], box = (cx, cy, cz, bw, bh, bd) => { const bg = new THREE.BoxGeometry(bw, bh, bd), e = new THREE.EdgesGeometry(bg), a = e.attributes.position.array; for (let i = 0; i < a.length; i += 3) pts.push(a[i] + cx, a[i + 1] + cy, a[i + 2] + cz); bg.dispose(); e.dispose(); };
    box(0, 0, 0, w, .06, d); o.pads.forEach(px => box(px, .17, pz, pw, .34, pw));
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    g.add(slab, grid, new THREE.LineSegments(lg, M(lineMat(0xF2F0EA, 0), .55)));
    const per = o.stack || 3, n = o.pads.length * per, m4 = new THREE.Matrix4();
    const inst = (geo, color, dx) => { const im = new THREE.InstancedMesh(geo, M(new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(.85), transparent: true, opacity: 0 }), 1), n); let k = 0; o.pads.forEach(px => { for (let i = 0; i < per; i++) im.setMatrixAt(k++, m4.makeTranslation(px + dx, .5 + i * .36, pz)); }); im.instanceMatrix.needsUpdate = true; im.frustumCulled = false; g.add(im); };
    inst(new THREE.CylinderGeometry(.8, .8, .34, 6), o.tokenColor, -1);
    inst(new THREE.CylinderGeometry(.74, .74, .24, 24), o.cashColor, 1);
    return { g, set(a, y = 0, s = 1) { g.visible = a > .01; g.position.y = (o.y || 0) + y; g.scale.setScalar(Math.max(.001, s)); mats.forEach(([m, k]) => (m.opacity = a * k)); } };
  }

  function dust(n = 420, box = [70, 34, 44], cy = -5) {
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { p[i * 3] = (Math.random() - .5) * box[0]; p[i * 3 + 1] = cy + (Math.random() - .5) * box[1]; p[i * 3 + 2] = (Math.random() - .5) * box[2]; }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ map: glowTex, size: .22, color: 0xF2F0EA, ...ADD, opacity: .28 }));
    root.add(pts); ticks.push(rt => { pts.rotation.y = rt * .012; });
    return pts;
  }

  return {
    V, label, note, plane, node, flow, beam, ring, block, frame, tile, dust,
    spark(color, s) { const sp = glow(color, s); root.add(sp); return sp; },
    tick(rt) { ticks.forEach(f => f(rt)); },
    clear() { scene.remove(root); root.traverse(x => { if (x.geometry && !x.isSprite) x.geometry.dispose(); if (x.material) x.material.dispose(); }); root = new THREE.Group(); scene.add(root); labels.forEach(l => l.el.remove()); labels.length = 0; ticks = []; },
  };
}
