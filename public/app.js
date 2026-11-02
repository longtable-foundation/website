(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pad = function (x) { return String(x).padStart(2, '0'); };
  var BASE = document.body.getAttribute('data-base') || '';
  var FORM_URL = document.body.getAttribute('data-form-endpoint') || '';
  var GFORM = null; try { GFORM = JSON.parse(document.body.getAttribute('data-gform') || 'null'); } catch (e) {}
  // Google Forms accepts a plain form POST from any site but gives no readable answer (no-cors).
  function sendGoogle(data) {
    var body = new URLSearchParams();
    Object.keys(GFORM.fields).forEach(function (k) { if (GFORM.fields[k] && data[k]) body.append(GFORM.fields[k], data[k]); });
    return fetch(GFORM.action, { method: 'POST', mode: 'no-cors', body: body }).then(function () { return {}; });
  }
  function send(data) {
    if (FORM_URL) return fetch(FORM_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error(j.error || 'Something went wrong. Try again.'); return j; }); });
    if (GFORM && GFORM.action) return sendGoogle(data);
    return Promise.reject(new Error('Sign-ups open soon. Try again later.'));
  }

  /* ---------- doc bar clock and settlement cycle ---------- */
  function tick() {
    var d = new Date(), h = d.getUTCHours(), m = d.getUTCMinutes(), s = d.getUTCSeconds();
    var secs = h * 3600 + m * 60 + s, cyc = Math.floor(h / 8) + 1;
    $$('[data-utc]').forEach(function (el) { el.textContent = pad(h) + ':' + pad(m) + ':' + pad(s); });
    $$('[data-cyc]').forEach(function (el) { el.textContent = cyc; });
    $$('[data-cycbar]').forEach(function (el) { el.style.width = ((secs % 28800) / 288).toFixed(1) + '%'; });
    $$('[data-cycclose]').forEach(function (el) { el.textContent = pad((cyc * 8) % 24) + ':00'; });
  }
  tick(); setInterval(tick, 1000);

  /* ---------- mobile menu ---------- */
  var mb = $('.menu-btn'), mn = $('#mnav');
  if (mb && mn) {
    mb.addEventListener('click', function () {
      var open = mb.getAttribute('aria-expanded') === 'true';
      mb.setAttribute('aria-expanded', String(!open)); mn.hidden = open;
    });
    mn.addEventListener('click', function (e) { if (e.target.closest('a')) { mb.setAttribute('aria-expanded', 'false'); mn.hidden = true; } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mn.hidden) { mb.setAttribute('aria-expanded', 'false'); mn.hidden = true; mb.focus(); } });
  }

  /* ---------- use case accordion ---------- */
  $$('[data-acc]').forEach(function (acc) {
    var btns = $$('.acc-b', acc);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') === 'true';
        btns.forEach(function (o) { o.setAttribute('aria-expanded', 'false'); $('.sg', o).textContent = '+'; document.getElementById(o.getAttribute('aria-controls')).hidden = true; });
        if (!open) { b.setAttribute('aria-expanded', 'true'); $('.sg', b).textContent = '−'; document.getElementById(b.getAttribute('aria-controls')).hidden = false; }
      });
    });
  });

  /* ---------- FIG 4: agents squares ---------- */
  $$('[data-agents]').forEach(function (fig) {
    var inp = $('input', fig);
    function draw() {
      var n = +inp.value, b = n * (n - 1);
      $('[data-n]', fig).textContent = n; $('[data-bil]', fig).textContent = b; $('[data-clr]', fig).textContent = n;
      $('[data-bilsq]', fig).innerHTML = new Array(b + 1).join('<i></i>');
      $('[data-clrsq]', fig).innerHTML = new Array(n + 1).join('<i></i>');
    }
    inp.addEventListener('input', draw); draw();
  });

  /* ---------- FIG 3.2.1: mesh ---------- */
  $$('[data-mesh]').forEach(function (fig) {
    var inp = $('input', fig);
    function line(x1, y1, x2, y2) { return '<span class="e" style="left:' + x1 + 'px;top:' + y1 + 'px;width:' + Math.hypot(x2 - x1, y2 - y1).toFixed(1) + 'px;transform:rotate(' + (Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI).toFixed(2) + 'deg)"></span>'; }
    function draw() {
      var n = +inp.value, c = 140, R = 108, V = [], E = '', H = '', vs = '';
      for (var i = 0; i < n; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; V.push({ x: +(c + R * Math.cos(a)).toFixed(1), y: +(c + R * Math.sin(a)).toFixed(1), l: 'C' + (i + 1) }); }
      for (i = 0; i < n; i++) for (var j = i + 1; j < n; j++) E += line(V[i].x, V[i].y, V[j].x, V[j].y);
      V.forEach(function (v) { H += line(c, c, v.x, v.y); vs += '<span class="v" style="left:' + v.x + 'px;top:' + v.y + 'px">' + v.l + '</span>'; });
      $('[data-bil]', fig).innerHTML = E + vs;
      $('[data-hub]', fig).innerHTML = H + '<span class="hub"><b>Clearinghouse</b><small>ONE LEDGER</small></span>' + vs;
      $('[data-n]', fig).textContent = n; $('[data-n2]', fig).textContent = n; $('[data-sub]', fig).textContent = n * (n - 1);
    }
    inp.addEventListener('input', draw); draw();
  });

  /* ---------- get involved tabs ---------- */
  var paths = $('[data-paths]');
  if (paths) {
    var tabs = $$('[data-path]', paths), done = $('[data-done]', paths), cur = 'follow';
    var show = function (id, focus) {
      cur = id; done.hidden = true;
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-path') === id;
        t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
        document.getElementById('pane-' + t.getAttribute('data-path')).hidden = !on;
        if (on && focus) t.focus();
      });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t.getAttribute('data-path')); });
      t.addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (k) { e.preventDefault(); show(tabs[(i + k + tabs.length) % tabs.length].getAttribute('data-path'), true); }
      });
    });
    var q = new URLSearchParams(location.search).get('path');
    show(tabs.some(function (t) { return t.getAttribute('data-path') === q; }) ? q : 'follow');
    $('[data-reset]', paths).addEventListener('click', function () { show(cur); });
    paths.addEventListener('lt-sent', function (e) {
      document.getElementById('pane-' + e.detail).hidden = true; done.hidden = false; done.focus();
    });
  }

  /* ---------- forms ---------- */
  var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };
  $$('form[data-form]').forEach(function (f) {
    var msg = $('[data-msg]', f.parentNode.classList.contains('subbox') ? f.parentNode : f), base = msg ? msg.textContent : '';
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {}; new FormData(f).forEach(function (v, k) { data[k] = String(v).trim(); });
      data.type = f.getAttribute('data-form'); data.page = location.pathname;
      var bad = !emailOk(data.email || '') ? 'Enter a valid work email.' : ('organization' in data && !data.organization) ? 'Enter your organization.' : '';
      if (bad) { if (msg) { msg.textContent = bad; msg.classList.add('err'); } return; }
      if (data.website) { f.reset(); return; } // honeypot: bots fill the hidden field
      delete data.website;
      var btn = $('button[type=submit]', f), label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending…';
      send(data)
        .then(function () {
          f.reset(); if (msg) { msg.classList.remove('err'); msg.textContent = base; }
          if (paths && paths.contains(f)) paths.dispatchEvent(new CustomEvent('lt-sent', { detail: data.type }));
          else if (msg) msg.textContent = 'Thank you. You are subscribed.';
        })
        .catch(function (err) { if (msg) { msg.textContent = err.message; msg.classList.add('err'); } })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  });

  /* ---------- press: chapters and boilerplate ---------- */
  $$('[data-chapters]').forEach(function (box) {
    var yt = box.getAttribute('data-yt');
    $$('button[data-ts]', box).forEach(function (b, _, all) {
      b.addEventListener('click', function () {
        all.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        var badge = $('[data-chap-badge]', box); if (badge) badge.textContent = 'STARTS AT ' + b.getAttribute('data-ts') + ' · ' + b.getAttribute('data-t');
        var a = $('a.vid', box); if (a && yt) a.href = 'https://www.youtube.com/watch?v=' + encodeURIComponent(yt) + '&t=' + b.getAttribute('data-s') + 's';
      });
    });
  });
  var cp = $('[data-copy]');
  if (cp) cp.addEventListener('click', function () {
    var t = $('[data-boiler]').textContent;
    var ok = function () { cp.textContent = 'Copied ✓'; clearTimeout(cp._t); cp._t = setTimeout(function () { cp.textContent = 'Copy text'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, ok); else ok();
  });

  /* ---------- skullet loading states ---------- */
  var THEME = {
    light: { base: 'rgb(17 17 17 / 0.07)', highlight: 'rgb(255 255 255 / 0.65)' },
    dark: { base: 'rgb(242 240 234 / 0.07)', highlight: 'rgb(242 240 234 / 0.12)' },
    radius: '2px', animation: 'shimmer', speed: 'slow'
  };
  var sk = import(BASE + '/vendor/skullet/index.mjs').then(function (m) { m.applyTheme(THEME, 'light'); return m; })
    .catch(function (e) { console.warn('skullet unavailable: ' + e); return null; });
  var frag = function (html) { var t = document.createElement('template'); t.innerHTML = html; return t.content; };
  var vars = function (el, v) { Object.keys(v).forEach(function (k) { el.style.setProperty(k, v[k]); }); };

  // YouTube thumbnails: skeleton until the image has loaded
  sk.then(function (m) {
    if (!m) return;
    $$('.vid.has-img').forEach(function (v) {
      var img = $('img', v); if (!img || (img.complete && img.naturalWidth)) return;
      var content = document.createDocumentFragment(); content.append.apply(content, Array.prototype.slice.call(v.childNodes));
      var r = new m.Reveal(v, { label: 'Loading video thumbnail' });
      r.load(content.cloneNode(true));
      var done = function () { r.show(content); };
      img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true });
    });
  });

  /* ---------- 3D steppers ---------- */
  var FILES = { prefund: 'scene-prefund.js', rfq: 'scene-rfq.js', clearing: 'scene-clearing.js', bridge: 'scene-bridge.js' };
  var active = null, all = [];
  function Stepper(root) {
    this.root = root; this.scene = root.getAttribute('data-stepper'); this.skipN = +root.getAttribute('data-skip') || 0;
    this.stageEl = $('[data-stage]', root); this.canvas = $('[data-canvas]', root);
    this.step = 0; this.vis = false; this.touched = false; this.lastUi = 0;
    var self = this;
    this.skReady = sk.then(function (m) { if (m) self.skeleton(m); return m; });
    new ResizeObserver(function () { self.fit(); }).observe(this.stageEl); this.fit();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { self.setVis(e.isIntersecting); }); }, { rootMargin: '-8% 0px -8% 0px' }).observe(this.stageEl);
    } else this.setVis(true);
    this.px = null;
    this.stageEl.addEventListener('pointerdown', function (e) { self.px = e.clientX; self.py = e.clientY; });
    this.stageEl.addEventListener('pointerup', function (e) {
      if (self.px == null) return;
      var dx = e.clientX - self.px, dy = e.clientY - self.py; self.px = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) { dx < 0 ? self.next() : self.back(); }
      else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) self.next();
    });
    root.addEventListener('keydown', function (e) {
      if (e.target.closest('button') && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); self.next(); } else if (e.key === 'ArrowLeft') { e.preventDefault(); self.back(); }
    });
    $('[data-next]', root).addEventListener('click', function () { self.next(); });
    $('[data-back]', root).addEventListener('click', function () { self.back(); });
    $('[data-fs]', root).addEventListener('click', function (e) {
      e.stopPropagation();
      if (document.fullscreenElement) document.exitFullscreen(); else if (self.stageEl.requestFullscreen) self.stageEl.requestFullscreen().catch(function () {});
    });
    document.addEventListener('fullscreenchange', function () { setTimeout(function () { self.fit(); }, 60); });
  }
  // Skullet skeletons for the caption, the step bar and the dark stage while the scene loads
  Stepper.prototype.skeleton = function (m) {
    if (this.def) return;
    var cue = $('.cue', this.root), segs = $('[data-segs]', this.root), msg = $('[data-msg]', this.root);
    this.cueReal = document.createDocumentFragment(); this.cueReal.append.apply(this.cueReal, Array.prototype.slice.call(cue.childNodes));
    this.cueR = new m.Reveal(cue, { label: 'Loading explainer', id: 'lt-cue-' + this.scene });
    this.cueR.load(frag('<span class="eyebrow">Step 01 · Actors</span><p>Each venue settles atomically, so each one needs its own tokens and stablecoins before the first trade.</p>'));
    this.segR = new m.Reveal(segs, { id: 'lt-segs-' + this.scene });
    this.segR.load(frag('<div class="segs-in">' + new Array(8).join('<span class="seg"><span class="tr"></span><span class="sl">00 Step</span></span>') + '</div>'));
    vars(this.stageEl, m.themeVariables(THEME, 'dark'));
    msg.textContent = '';
    var bones = document.createElement('div'); bones.className = 'bones'; bones.setAttribute('aria-hidden', 'true');
    [[22, 34, 9], [40, 34, 11], [58, 34, 9], [76, 34, 9], [49, 60, 12], [30, 80, 40]].forEach(function (b, bi) {
      var x = m.createSkeletonBox({ width: b[2] + '%', height: bi === 5 ? '4px' : '7%' }); x.style.position = 'absolute'; x.style.left = (b[0] - b[2] / 2) + '%'; x.style.top = b[1] + '%';
      bones.appendChild(x);
    });
    var sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = 'Loading 3D scene';
    msg.append(bones, sr);
  };
  Stepper.prototype.fit = function () {
    var el = this.stageEl, cw = el.clientWidth || 928, ch = el.clientHeight || cw * 9 / 16;
    var s = Math.min(cw / 1920, ch / 1080), ox = (cw - 1920 * s) / 2, oy = (ch - 1080 * s) / 2;
    this.canvas.style.transform = 'translate(' + ox + 'px,' + oy + 'px) scale(' + s + ')';
    this.root.classList.toggle('compact', this.root.clientWidth < 600);
  };
  Stepper.prototype.setVis = function (v) {
    if (v === this.vis) return; this.vis = v;
    if (v) this.init();
    syncAll();
  };
  Stepper.prototype.free = function () { return !active || active === this || !active.vis; };
  Stepper.prototype.sync = function () {
    if (!this.stage) return;
    if (this.vis && this.free()) active = this;
    var run = this.vis && active === this;
    if (run && !this.stage.running) this.stage.start();
    if (!run && this.stage.running) this.stage.stop();
  };
  Stepper.prototype.claim = function () { active = this; syncAll(); };
  Stepper.prototype.init = function () {
    if (this.stage || this.initing) return;
    this.initing = true;
    var self = this, msg = $('[data-msg]', this.root);
    var pr = Math.min(1, Math.max(0.4, (this.stageEl.clientWidth || 928) * (window.devicePixelRatio || 1) / 1920));
    import(BASE + '/anim/stage3d.js').then(function (m) {
      self.stage = m.createStage($('[data-gl]', self.root), $('[data-lab]', self.root), { pixelRatio: pr });
      self.stage.onTime(function (t, playing) {
        var now = performance.now();
        if (now - self.lastUi > 80 || playing !== self.playing) { self.lastUi = now; self.playing = playing; self.render(t); }
      });
      return import(BASE + '/anim/' + FILES[self.scene]);
    }).then(function (mod) {
      return self.skReady.then(function () { return mod; });
    }).then(function (mod) {
      self.def = self.stage.load(mod.default);
      self.skip = Math.max(0, Math.min(self.skipN, self.def.beats.length - 1));
      if (self.cueR) self.cueR.show(self.cueReal);
      self.buildSegs();
      if (self.vis && self.free()) { active = self; self.stage.seek(self.bStart(0)); self.stage.playTo(self.bEnd(0)); }
      else self.stage.seek(self.bEnd(0));
      self.stage.start();
      msg.hidden = true; $('[data-hint]', self.root).hidden = false;
      self.render(self.stage.t);
      setTimeout(syncAll, 450);
    }).catch(function (err) {
      console.error('Longtable stepper: ' + err);
      msg.textContent = '3D scene unavailable in this browser'; msg.hidden = false;
    }).then(function () { self.initing = false; });
  };
  Stepper.prototype.count = function () { return this.def ? this.def.beats.length - this.skip : 0; };
  Stepper.prototype.bStart = function (i) { return this.def.beats[i + this.skip].t; };
  Stepper.prototype.bEnd = function (i) { var b = this.def.beats, j = i + this.skip; return j + 1 < b.length ? b[j + 1].t : this.def.duration; };
  Stepper.prototype.go = function (i) {
    if (!this.def) return;
    i = Math.max(0, Math.min(this.count() - 1, i));
    this.claim();
    this.stage.seek(this.bStart(i)); this.stage.playTo(this.bEnd(i));
    this.step = i;
    if (!this.touched) { this.touched = true; $('[data-hint]', this.root).hidden = true; }
    this.render(this.stage.t);
  };
  Stepper.prototype.next = function () {
    if (!this.def) return;
    if (this.step < this.count() - 1) return this.go(this.step + 1);
    if (this.stage.playing) { this.claim(); this.stage.seek(this.def.duration); return; }
    this.go(0);
  };
  Stepper.prototype.back = function () { if (this.def) this.go(this.step - 1); };
  Stepper.prototype.buildSegs = function () {
    var self = this, box = $('[data-segs]', this.root), bs = this.def.beats.slice(this.skip);
    var wrap = document.createElement('div'); wrap.className = 'segs-in';
    wrap.innerHTML = bs.map(function (b, j) { return '<button class="seg" type="button" title="' + b.label + '"><span class="tr"><i></i></span><span class="sl">' + pad(j + 1) + ' ' + b.label + '</span></button>'; }).join('');
    $$('.seg', wrap).forEach(function (s, j) { s.addEventListener('click', function () { self.go(j); }); });
    this.segs = $$('.seg', wrap);
    if (this.segR) this.segR.show(wrap); else box.appendChild(wrap);
  };
  Stepper.prototype.render = function (t) {
    if (!this.def) return;
    var bs = this.def.beats.slice(this.skip), n = bs.length, i = this.step, cur = bs[i] || {}, self = this;
    $$('[data-no]', this.root).forEach(function (e) { e.textContent = pad(i + 1); });
    $$('[data-total]', this.root).forEach(function (e) { e.textContent = pad(n); });
    $$('[data-label]', this.root).forEach(function (e) { e.textContent = cur.label || ''; });
    $$('[data-cue]', this.root).forEach(function (e) { if (e.textContent !== cur.cue) e.textContent = cur.cue || ''; });
    var st = this.def.statement, on = !!(st && t >= st.from && t < (st.to == null ? 1e9 : st.to)), se = $('[data-stmt]', this.root);
    if (st && se.textContent !== st.text) se.textContent = st.text;
    se.style.opacity = on ? 1 : 0;
    $('[data-next]', this.root).textContent = i < n - 1 ? 'Next step →' : (this.playing ? 'Skip to end' : 'Start over ↺');
    (this.segs || []).forEach(function (s, j) {
      var a = self.bStart(j), z = self.bEnd(j), p = j < i ? 1 : j > i ? 0 : Math.max(0, Math.min(1, (t - a) / Math.max(0.001, z - a)));
      s.firstChild.firstChild.style.width = (p * 100).toFixed(1) + '%';
      s.classList.toggle('on', j === i);
    });
  };
  function syncAll() { all.forEach(function (s) { s.sync(); }); }
  $$('[data-stepper]').forEach(function (el) { all.push(new Stepper(el)); });
})();
