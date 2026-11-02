// Slide 06: market-maker capital is pre-funded on every venue, then multiplied across chains and token forms
export default function prefund(kit, h) {
  const { win, ease, hold, C } = h;
  const X = [-13.5, -4.5, 4.5, 13.5], NAMES = ['CEX', 'Onchain RFQ', 'DEX pool', 'Order book'], Z = 1.5;
  const B = [0, 2.8, 7.6, 12.4, 18, 22.4, 26.8], D = 31.8;
  const CHAINS = ['SOLANA', 'ETHEREUM', 'ARBITRUM'], FLAVORS = ['TSLAx · xStocks', 'TSLAb · bStocks', 'TSLAc · Coinbase', 'TSLAr · Robinhood', 'TSLAon · Ondo'], CX = 44, RZ = 21;
  kit.dust(380, [84, 36, 46], -5);
  const up = kit.plane({ y: 0, w: 36, d: 13, color: C.msg, label: 'TSLAx', labelColor: '#F8D028' });
  const lo = kit.plane({ y: -8, w: 36, d: 13, color: C.msg, label: 'BALANCE SHEET' });
  const V = X.map((x, i) => kit.node({ pos: [x, 0, Z], w: 4.4, d: 4.4, label: NAMES[i] }));
  const mm = kit.node({ pos: [0, -8, Z], w: 5.6, d: 5.6, color: C.msg, label: 'Market maker' });
  const src = (v, i) => [v % 2 ? 1.15 : -1.15, -8 + .5 + i * .36, Z + (v < 2 ? -1.15 : 1.15)];
  const dst = (v, i) => [X[v] + (i < 3 ? 1 : -1), .5 + (i % 3) * .36, Z];
  const Bk = [];
  for (let v = 0; v < 4; v++) for (let i = 0; i < 6; i++) {
    const cash = i < 3, s = B[1] + .6 + v * .55 + i * .1;
    Bk.push({ v, i, s, e: s + 1.5, f: kit.flow(src(v, i), dst(v, i), { color: cash ? C.cash : C.token, lift: 3, r: .012 }), b: kit.block(cash ? C.cash : C.token, cash ? 'cash' : 'token', { spin: false }) });
  }
  const front = k => [X[1] + (k - 1) * 1.3, .8, 11];
  const sold = [0, 1, 2].map(k => ({ s: B[2] + 1.2 + k * .8, f: kit.flow(dst(1, 5 - k), front(k), { color: C.token, lift: 1.6, r: .012 }) }));
  const paid = [0, 1, 2].map(k => ({ s: B[2] + 1.7 + k * .8, f: kit.flow(front(k), [X[1] + 1, .5 + (3 + k) * .36, Z], { color: C.cash, lift: 1.6, r: .012 }), b: kit.block(C.cash, 'cash', { spin: false }) }));
  const rfqs = [0, 1, 2].map(k => ({ s: B[2] + .6 + k * .8, f: kit.flow([X[1] + (k - 1) * 1.3, .3, 12.5], [X[1], .4, Z + 1.4], { color: C.msg, lift: .8, r: .015 }) }));
  const hopPts = [dst(2, 5), [X[2] - 1, 3, Z], [X[1] - 1, 3, Z], [X[1] - 1, .5, Z]];
  const hops = [0, 1, 2].map(k => kit.flow(hopPts[k], hopPts[k + 1], { color: C.token, lift: 0, r: .03 }));
  const HT = [[B[3] + .6, B[3] + 1.4], [B[3] + 1.8, B[3] + 3.4], [B[3] + 3.8, B[3] + 4.6]];
  const rebB = kit.block(C.token, 'token', { spin: false });
  const rebLab = kit.note([-.5, 3, Z], 'WITHDRAW · REDEPOSIT', { ay: '12px' });
  const tiles = [];
  for (let r = 0; r < FLAVORS.length; r++) for (let c = 0; c < 3; c++) if (r || c) tiles.push({ s: r ? B[6] + 1 + (r - 1) * .45 + c * .12 : B[5] + 1 + c * .3, k: kit.tile({ x: c * CX, z: -r * RZ, w: 36, d: 13, pads: X, padZ: Z, tokenColor: C.token, cashColor: C.cash }) });
  const chainLab = CHAINS.map((n, c) => kit.note([c * CX, 0, 9], n, { ay: '12px' }));
  const flavorLab = FLAVORS.map((n, r) => kit.note([-18, 0, -r * RZ - 7.2], n, { ax: '0%', subColor: '#F8D028' }));
  return {
    duration: D,
    statement: { text: 'Capital scales with venues, not with risk.', from: B[4] + 1.4, to: B[5] },
    fog: t => .009 - .0078 * ease(win(t, B[5], B[5] + 2.4)) - .0007 * ease(win(t, B[6], B[6] + 2.4)),
    beats: [
      { t: B[0], label: 'Capital', cue: 'A market maker wants to quote TSLAx, the xStocks Tesla token, on four venues. This is its capital.' },
      { t: B[1], label: 'Pre-fund', cue: 'Each venue settles atomically, so each one needs its own tokens and stablecoins before the first trade.' },
      { t: B[2], label: 'Demand', cue: 'Demand lands on one venue. Its tokens run out while capital sits idle on the others.' },
      { t: B[3], label: 'Rebalance', cue: 'Refilling it means withdrawing from one venue and redepositing on another. It’s slow and it costs money.' },
      { t: B[4], label: 'Gross, not net', cue: 'Positions don’t net across venues. Capital scales with the number of venues, not with the risk.' },
      { t: B[5], label: '× Chains', cue: 'And that’s just TSLAx on one chain. Repeat it for every chain the token trades on.' },
      { t: B[6], label: '× Token flavors', cue: 'Then repeat it for every flavor of tokenized Tesla: TSLAb, TSLAc, TSLAr, TSLAon. That’s the capital it takes to make markets in one stock.' },
    ],
    camera: [
      { t: 0, pos: [0, -3.5, 30], target: [0, -7, Z] },
      { t: B[1], dur: 2.2, pos: [0, 12, 48], target: [0, -3, Z] },
      { t: B[2], dur: 2, pos: [-9, 7, 29], target: [-4.5, -.5, 2] },
      { t: B[3], dur: 2, pos: [0, 9, 35], target: [0, -1, Z] },
      { t: B[4], dur: 2.6, pos: [0, 18, 56], target: [0, -4, 1] },
      { t: B[5], dur: 3, pos: [44, 96, 115], target: [44, 0, 0] },
      { t: B[6], dur: 3.2, pos: [44, 176, 134], target: [44, 0, -42] },
    ],
    update(t, rt) {
      const ap = ease(win(t, .2, 1.8)), na = ease(win(t, 1, 2.2)), zo = ease(win(t, B[5], B[5] + 1.2)), boost = hold(t, B[4] + .3, B[5]);
      up.set(ap, .3 + .7 * ease(win(t, B[1] + .2, B[1] + 1.6)));
      up.lab.alpha *= 1 - zo;
      lo.set(ap * (1 - zo), .9 - .5 * ease(win(t, B[2], B[2] + 1)));
      mm.set(na * (1 - zo), .9 - .7 * ease(win(t, B[1] + 1.8, B[1] + 4.2)));
      const out = t > B[2] + 3.6 && t < B[3] + 4.6;
      V.forEach((n, v) => {
        const g = v === 1 ? hold(t, B[2] + .6, B[3]) * .9 + hold(t, B[3] + 4.6, B[4]) * .7 : hold(t, B[1] + .6 + v * .55, B[2], .4, .6) * .6;
        n.set(na, g + boost * .5, out && v === 1 ? C.dim : null);
        n.lab.alpha = na * (1 - zo);
      });
      Bk.forEach(x => {
        const u = ease(win(t, x.s, x.e));
        x.f.heads([t > x.s && t < x.e ? u : null], .9, .7);
        x.f.route(hold(t, x.s - .1, B[2]) * .4);
        let vis = 1, p = x.f.curve.getPoint(t < x.s ? 0 : u);
        if (x.v === 1 && x.i >= 3) { const sd = sold[5 - x.i]; if (t > sd.s) { p = sd.f.curve.getPoint(ease(win(t, sd.s, sd.s + 1.2))); vis = 1 - win(t, sd.s + 1, sd.s + 1.4); } }
        if (x.v === 2 && x.i === 5 && t > HT[0][0]) vis = 0;
        x.b.set(p, vis * ap, 0, boost);
      });
      sold.forEach(sd => { const u = win(t, sd.s, sd.s + 1.2); sd.f.heads([u > 0 && u < 1 ? ease(u) : null], .9, .7); sd.f.route(hold(t, sd.s, B[3]) * .35); });
      paid.forEach(x => { const u = ease(win(t, x.s, x.s + 1.2)); x.f.heads([t > x.s && t < x.s + 1.2 ? u : null], .9, .7); x.f.route(hold(t, x.s, B[3]) * .35); x.b.set(x.f.curve.getPoint(u), t > x.s ? 1 : 0, 0, boost); });
      rfqs.forEach(x => { const u = win(t, x.s, x.s + .7); x.f.heads([u > 0 && u < 1 ? ease(u) : null], 1, .8); x.f.route(hold(t, x.s - .1, B[3]) * .5); });
      let rp = hopPts[0];
      hops.forEach((f, k) => { const [a, b] = HT[k], u = ease(win(t, a, b)); f.heads([t > a && t < b ? u : null], .9, .8); f.route(hold(t, a - .1, B[4]) * .6); if (t >= a) rp = f.curve.getPoint(u); });
      rebB.set(rp, t > HT[0][0] ? 1 : 0, 0, boost);
      rebLab.alpha = hold(t, B[3] + .6, B[4]);
      tiles.forEach(x => { const a = ease(win(t, x.s, x.s + .8)); x.k.set(a, -5 * (1 - a), .7 + .3 * a); });
      chainLab.forEach((l, c) => (l.alpha = ease(win(t, B[5] + 1.2 + c * .3, B[5] + 1.8 + c * .3))));
      flavorLab.forEach((l, r) => { const s = r ? B[6] + 1.2 + (r - 1) * .45 : B[5] + .8; l.alpha = ease(win(t, s, s + .6)); });
    },
  };
}
