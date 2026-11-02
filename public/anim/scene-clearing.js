// Slide 08: the guarantee moves from Alpaca to a multimodal clearinghouse
export default function clearing(kit, h) {
  const { win, ease, hold, C } = h;
  const X = [-13.5, -4.5, 4.5, 13.5], NAMES = ['CEX', 'Onchain RFQ', 'DEX pool', 'Order book'], Z = 1.5;
  const MX = [-11, 0, 11], MN = ['Broker-dealer', 'Alpaca', 'Broker-dealer'];
  const B = [0, 3.2, 6.6, 10.4, 14.8, 18.8], D = 23;
  kit.dust(420, [90, 44, 50], -8);
  const pv = kit.plane({ y: 0, w: 36, d: 13, color: C.msg, label: 'VENUES' });
  const pm = kit.plane({ y: -8, w: 36, d: 13, color: C.share, label: 'BROKER-DEALERS', labelColor: '#7FB0EE' });
  const pc = kit.plane({ y: -16, w: 40, d: 14, color: C.token, label: 'MULTIMODAL CLEARINGHOUSE', labelColor: '#F8D028' });
  const V = X.map((x, i) => kit.node({ pos: [x, 0, Z], w: 4.4, d: 4.4, label: NAMES[i] }));
  const M = MX.map((x, i) => kit.node({ pos: [x, -8, Z], w: 3.6, d: 3.6, color: i === 1 ? C.token : C.share, label: MN[i] }));
  const dtcc = kit.node({ pos: [27, -16, 0], w: 4, d: 4, color: C.share, label: 'DTCC' });
  const KEEP = { '0-0': [1, 0], '2-0': [1, 1], '0-3': [-1, 0], '2-3': [-1, 1] }, CEN = [0, -15.5, Z];
  const T = [];
  X.forEach((x, v) => { for (let i = 0; i < 6; i++) { const cash = i < 3, home = [x + (cash ? 1 : -1), .5 + (i % 3) * .36, Z], kp = KEEP[v + '-' + i]; const dest = kp ? [kp[0], -15.5 + kp[1] * .36, Z] : CEN; T.push({ v, i, home, kept: !!kp, s: B[3] + 1.8 + v * .2 + i * .05, f: kit.flow(home, dest, { color: cash ? C.cash : C.token, lift: 2, r: .01 }), b: kit.block(cash ? C.cash : C.token, cash ? 'cash' : 'token', { spin: false }) }); } });
  const ringA = kit.ring([0, -8, Z], { r: 3.2, label: 'GUARANTEE' });
  const ringB = kit.ring([0, -16, 0], { rx: 18.6, rz: 6.4, back: true, labelDx: 12, label: 'GUARANTEE' });
  const link = kit.beam([0, -7.4, Z], [-4.5, .1, Z], { color: C.token, r: .22 });
  const mBeams = MX.map(x => kit.beam([x, -7.9, Z], [x, -15.9, Z], { color: C.share, r: .2 }));
  const vBeams = X.map(x => kit.beam([x, -.1, Z], [x, -15.9, Z], { color: C.msg, r: .12 }));
  const pool = kit.spark(C.token, 9); pool.position.set(0, -15, Z);
  const obl = [];
  X.forEach((x, v) => [0, 1].forEach(j => obl.push({ s: B[4] + .3 + (v * 2 + j) * .2, f: kit.flow([x + (j ? .8 : -.8), .4, Z], [j ? .3 : -.3, -15.3, Z], { color: j ? C.cash : C.token, lift: 1, r: .008 }) })));
  const netF = kit.flow([0, -15.4, Z], [11, -7.44, Z], { color: C.token, lift: 2.5, r: .03 });
  const net = kit.block(C.token, 'token');
  const netLab = kit.note([0, -13.6, Z], 'ONLY THE NET SETTLES', { subColor: '#F8D028' });
  const cr1 = kit.flow([20.2, -15.6, 0], [25, -15.5, 0], { color: C.token, lift: 1.8, r: .02 });
  const cr2 = kit.flow([25, -15.5, 0], [20.2, -15.6, 0], { color: C.share, lift: -1.2, r: .02 });
  const crLab = kit.note([22.6, -12.6, 0], 'INTER-AGENCY CREDITS');
  return {
    duration: D,
    fog: () => .007,
    beats: [
      { t: B[0], label: 'Pre-funded', cue: 'Back to the venues. Every one of them is pre-funded, and each broker-dealer works on its own.' },
      { t: B[1], label: 'ITN today', cue: 'ITN already removes pre-funding on onchain RFQ, because Alpaca gives the guarantee. That guarantee stops at Alpaca.' },
      { t: B[2], label: 'Clearinghouse', cue: 'A multimodal clearinghouse takes over the guarantee.' },
      { t: B[3], label: 'Connect', cue: 'Broker-dealers and venues connect to it. The inventory parked on each venue collapses into one pool, sized to net risk.' },
      { t: B[4], label: 'Netting', cue: 'Trades from every venue net in the clearinghouse. Only the difference settles.' },
      { t: B[5], label: 'DTCC', cue: 'DTCC connects too. Inter-agency credits run both ways: assets at DTCC count at the clearinghouse, and onchain or pledged assets count at DTCC.' },
    ],
    camera: [
      { t: 0, pos: [0, 12, 54], target: [0, -4.5, Z] },
      { t: B[1], dur: 2, pos: [-2, 9, 46], target: [-2, -4.5, Z] },
      { t: B[2], dur: 2.4, pos: [0, 10, 76], target: [0, -6, Z] },
      { t: B[4], dur: 2, pos: [0, 8, 70], target: [0, -6.5, Z] },
      { t: B[5], dur: 2.2, pos: [8, 8, 76], target: [6, -7, Z] },
    ],
    update(t, rt) {
      const ap = ease(win(t, .2, 1.8)), na = ease(win(t, 1, 2.2)), ch = ease(win(t, B[2] + .3, B[2] + 1.4)), itn = t > B[1] + 1.8 && t < B[2] + 1.2;
      pv.set(ap, .5); pm.set(ap, .35 + .4 * hold(t, B[3] + .2, D + 9)); pc.set(ch, .4 + .6 * hold(t, B[2] + 1.8, D + 9));
      V.forEach((n, v) => n.set(na, (v === 1 ? hold(t, B[1] + 1.8, B[2] + 1) * .8 : 0) + hold(t, B[3] + .8 + v * .15, D + 9) * .5, v === 1 && itn ? C.token : null));
      M.forEach((n, i) => n.set(na, (i === 1 ? hold(t, B[1] + .2, B[2] + 1.6) * .9 : 0) + hold(t, B[3] + .2 + i * .15, D + 9) * .6));
      const dr = ease(win(t, B[2] + 1, B[2] + 2.6));
      ringA.move([0, -8 - 8 * dr, Z], 1 + 1.4 * dr);
      ringA.set(ease(win(t, B[1] + .3, B[1] + 1)) * (1 - ease(win(t, B[2] + 1.6, B[2] + 2.6))), rt);
      const gr = ease(win(t, B[2] + 1.8, B[2] + 2.9));
      ringB.move([0, -16, 0], .55 + .45 * gr); ringB.set(gr, rt);
      link.set(ease(win(t, B[1] + .8, B[1] + 1.8)), hold(t, B[1] + .8, B[2] + 1, .3, .6) * (.8 + .2 * Math.sin(rt * 3))); link.hit(win(t, B[1] + 1.8, B[1] + 2.5));
      mBeams.forEach((b, i) => { const s = B[3] + .2 + i * .15; b.set(ease(win(t, s, s + .8)), hold(t, s, D + 9) * .6); });
      vBeams.forEach((b, v) => { const s = B[3] + .8 + v * .15; b.set(ease(win(t, s, s + 1)), hold(t, s, D + 9) * .4); });
      T.forEach(x => {
        if (x.v === 1) { const u = ease(win(t, B[1] + 1.8, B[1] + 2.6)); x.b.set([x.home[0], x.home[1] + 1.5 * u, x.home[2]], na * (1 - u)); return; }
        const u = ease(win(t, x.s, x.s + 1.4));
        x.f.heads([t > x.s && t < x.s + 1.4 ? u : null], .8, .6); x.f.route(hold(t, x.s, B[4]) * .25);
        x.b.set(x.f.curve.getPoint(t < x.s ? 0 : u), na * (x.kept ? 1 : 1 - win(t, x.s + 1.3, x.s + 1.55)));
      });
      pool.material.opacity = hold(t, B[3] + 3, B[3] + 3.6, .2, .5) + hold(t, B[4] + 1.2, B[4] + 2.6, .3, .5) * (.7 + .3 * Math.sin(rt * 6));
      pool.scale.setScalar(7 + 3 * pool.material.opacity);
      obl.forEach(o => { const u = win(t, o.s, o.s + 1.3); o.f.heads([u > 0 && u < 1 ? ease(u) : null], .9, .7); o.f.route(hold(t, o.s, B[5]) * .3); });
      const nu = ease(win(t, B[4] + 2.8, B[4] + 3.6));
      netF.heads([t > B[4] + 2.8 && t < B[4] + 3.6 ? nu : null], .9); netF.route(hold(t, B[4] + 2.6, B[5]) * .5);
      net.set(netF.curve.getPoint(nu), ease(win(t, B[4] + 2.4, B[4] + 2.8)));
      netLab.alpha = hold(t, B[4] + 2.4, B[5]);
      const da = ease(win(t, B[5] + .6, B[5] + 1.4)); dtcc.set(da, da * .8);
      const ca = ease(win(t, B[5] + 1.2, B[5] + 1.8)), cu = (rt * .45) % 1;
      cr1.heads([ca ? cu : null, ca ? (cu + .5) % 1 : null], ca, .9); cr1.route(ca * .7);
      cr2.heads([ca ? (cu + .25) % 1 : null, ca ? (cu + .75) % 1 : null], ca, .9); cr2.route(ca * .7);
      crLab.alpha = ease(win(t, B[5] + 1.4, B[5] + 2));
    },
  };
}
