// Slide 10: cross-chain clearing with Across, on the same post-trade settlement primitive
export default function bridge(kit, h) {
  const { win, ease, hold, C } = h;
  const B = [0, 3, 5.8, 9, 11.8, 15.8, 18.8, 22.8, 26.2], D = 29.4;
  const P = { uA: [-18, 0, 3], acr: [-13, 0, -1.5], itnA: [-8, 0, 3], rel: [0, 0, 3], itnB: [8, 0, 3], uB: [18, 0, 3], issX: [-8, -8, 2], relAcc: [0, -8, 2], issY: [8, -8, 2] };
  kit.dust(400, [90, 40, 46], -4);
  const pA = kit.plane({ x: -12, y: 0, w: 20, d: 12, color: C.token, label: 'CHAIN A', labelColor: '#F8D028' });
  const pB = kit.plane({ x: 12, y: 0, w: 20, d: 12, color: C.token, label: 'CHAIN B', labelColor: '#F8D028' });
  const pL = kit.plane({ y: -8, w: 44, d: 12, color: C.share, label: 'ALPACA LEDGER', labelColor: '#7FB0EE' });
  const N = {
    uA: kit.node({ pos: P.uA, label: 'User' }),
    acr: kit.node({ pos: P.acr, w: 3, d: 3, label: 'Across' }),
    itnA: kit.node({ pos: P.itnA, w: 2.8, d: 2.8, color: C.token, label: 'ITN' }),
    rel: kit.node({ pos: P.rel, w: 2.6, d: 2.6, label: 'Relayer' }),
    itnB: kit.node({ pos: P.itnB, w: 2.8, d: 2.8, color: C.token, label: 'ITN' }),
    uB: kit.node({ pos: P.uB, label: 'User' }),
    issX: kit.node({ pos: P.issX, w: 2.8, d: 2.8, color: C.share, label: 'Issuer X' }),
    relAcc: kit.node({ pos: P.relAcc, w: 2.8, d: 2.8, color: C.share, label: 'Relayer account' }),
    issY: kit.node({ pos: P.issY, w: 2.8, d: 2.8, color: C.share, label: 'Issuer Y' }),
  };
  const top = (p, k = 0) => [p[0], p[1] + .56 + k * .36, p[2]];
  const mv = (a, b, color, shape, lift) => ({ f: kit.flow(a, b, { color, lift, r: .03 }), b: kit.block(color, shape) });
  const TA = [0, 1, 2, 3].map(() => kit.block(C.token, 'token', { spin: false })), TB = [0, 1, 2, 3].map(() => kit.block(C.token, 'token', { spin: false }));
  const tpos = (x, i, dy) => [x, .2 + i * .36 + dy, -2.5];
  const dep = mv(top(P.uA), top(P.acr), C.token, 'token', 1.8);
  const vBeam = kit.beam(top(P.relAcc, -1), top(P.rel, -1), { color: C.msg, r: .2 });
  const fillMsg = kit.flow(top(P.rel, -1), top(P.itnB, -1), { color: C.msg, lift: 1.6, r: .02 });
  const flash = kit.spark(C.token, 10); flash.position.set(P.itnB[0], 1.2, P.itnB[2]);
  const tokY = mv(top(P.itnB), top(P.uB), C.token, 'token', 2.6);
  const repay = mv(top(P.acr), top(P.rel), C.token, 'token', 3);
  const redeem = mv(top(P.rel), top(P.itnA), C.token, 'token', 1.6);
  const burn = kit.beam(top(P.itnA, -1), top(P.issX, -1), { color: C.token, r: .32 });
  const rel = mv(top(P.issX), top(P.relAcc), C.share, 'share', 2);
  const settle = mv(top(P.relAcc), top(P.issY), C.share, 'share', 2);
  const owed = kit.block(C.share, 'share');
  const hitY = kit.spark(C.share, 9); hitY.position.set(P.issY[0], -7, P.issY[2]);
  const backing = kit.beam(top(P.issY, -1), top(P.itnB, -1), { color: C.share, r: .26 });
  const ring = kit.ring([0, -8, 2], { rx: 12, rz: 4.6, label: 'GUARANTEE' });
  const move = (m, t, a, b, z, al) => { const u = ease(win(t, a, b)); m.f.heads([t > a && t < b ? u : null], .9); m.f.route(hold(t, a - .2, z) * .5); m.b.set(m.f.curve.getPoint(t < a ? 0 : u), al); };
  return {
    duration: D,
    beats: [
      { t: B[0], label: 'Setup', cue: 'Across moves tokens between chains. A user on chain A wants a token on chain B.' },
      { t: B[1], label: 'Today', cue: 'Today a relayer can only fill if it already holds the token on the destination chain, so it pre-funds inventory on both sides of the bridge.' },
      { t: B[2], label: 'With ITN', cue: 'With ITN the inventory goes away. ITN runs on both chains, with Alpaca’s ledger underneath.' },
      { t: B[3], label: 'Deposit', cue: 'The user deposits token X into Across on chain A.' },
      { t: B[4], label: 'Mint', cue: 'Alpaca signs a voucher. The relayer fills through ITN on chain B, which mints token Y just in time for the user. Alpaca guarantees the share that will back it (outlined share = owed).' },
      { t: B[5], label: 'Repay', cue: 'Across repays the relayer on chain A with the user’s token X.' },
      { t: B[6], label: 'Redeem', cue: 'The relayer redeems token X through ITN. The underlying share is released to its Alpaca account.' },
      { t: B[7], label: 'Post-trade', cue: 'Post-trade, that share settles the token Y mint. It moves to issuer Y and token Y is fully backed.' },
      { t: B[8], label: 'Outcome', cue: 'Same primitive as the RFQ trade: mint at T, settle post-trade. No inventory on either chain.' },
    ],
    camera: [
      { t: 0, pos: [0, 12, 58], target: [0, -1.5, 1] },
      { t: B[1], dur: 1.8, pos: [0, 7, 38], target: [0, -1, 0] },
      { t: B[2], dur: 2.2, pos: [0, 11, 62], target: [0, -4.5, 1] },
      { t: B[3], dur: 1.8, pos: [-11, 7, 38], target: [-12, -1.5, 1] },
      { t: B[4], dur: 2, pos: [6, 6, 46], target: [7, -3.5, 1] },
      { t: B[5], dur: 2, pos: [-6, 8, 42], target: [-6, -1.5, 0] },
      { t: B[6], dur: 2, pos: [-5, 4, 44], target: [-5, -4.5, 1] },
      { t: B[7], dur: 2, pos: [5, 3, 44], target: [5, -5.5, 1] },
      { t: B[8], dur: 2.6, pos: [0, 13, 66], target: [0, -4.5, 1] },
    ],
    update(t, rt) {
      const ap = ease(win(t, .2, 1.8)), na = ease(win(t, 1, 2.2)), it = ease(win(t, B[2] + .8, B[2] + 1.6)), lg = ease(win(t, B[2] + 1.2, B[2] + 2.4));
      pA.set(ap, .4 + .6 * hold(t, B[3], B[6] + 2, .6, .8)); pB.set(ap, .4 + .6 * hold(t, B[4], B[5], .6, .8));
      pL.set(lg, .4 + .6 * hold(t, B[6] + 1, B[8], .6, .8));
      N.uA.set(na, hold(t, B[3] + .2, B[4]) * .8);
      N.acr.set(na, hold(t, B[3] + 1.6, B[6]) * .7);
      N.rel.set(na, hold(t, B[1] + .3, B[2]) * .8 + hold(t, B[4] + .9, B[5]) * .6 + hold(t, B[5] + 1.8, B[6] + 1.4) * .7);
      N.itnA.set(it, .3 + hold(t, B[6] + 1.2, B[7]) * .7);
      N.itnB.set(it, .3 + hold(t, B[4] + 1.8, B[5]) * .7 + hold(t, B[7] + 2.6, D + 9) * .6);
      N.uB.set(na, hold(t, B[4] + 3.2, B[5]) * .9);
      N.issX.set(lg, hold(t, B[6] + 2, B[7]) * .8);
      N.relAcc.set(lg, hold(t, B[4], B[4] + 1.2) * .8 + hold(t, B[6] + 3.4, B[7] + 1) * .7);
      N.issY.set(lg, .15 + hold(t, B[7] + 1.9, D + 9) * .75);
      const gone = ease(win(t, B[2] + .2, B[2] + 1));
      [[TA, -4], [TB, 4]].forEach(([T, x]) => T.forEach((b, i) => { const s = B[1] + .4 + i * .12 + (x > 0 ? .3 : 0), a = ease(win(t, s, s + .5)); b.set(tpos(x, i, -.6 * (1 - a) + 1.4 * gone), a * (1 - gone), 0, hold(t, B[1] + 1.4, B[2]) * .6); }));
      move(dep, t, B[3] + .4, B[3] + 1.8, B[4], t > B[3] + .1 && t < B[5] + .3 ? ease(win(t, B[3] + .1, B[3] + .4)) : 0);
      vBeam.set(ease(win(t, B[4] + .2, B[4] + 1)), hold(t, B[4] + .2, B[4] + 1.6, .2, .4), ease(win(t, B[4] + 1, B[4] + 1.6))); vBeam.hit(win(t, B[4] + 1, B[4] + 1.6));
      const fu = win(t, B[4] + 1, B[4] + 1.9); fillMsg.heads([fu > 0 && fu < 1 ? ease(fu) : null], 1, .8); fillMsg.route(hold(t, B[4] + .8, B[5]) * .55);
      const fl = hold(t, B[4] + 1.9, B[4] + 2.4, .25, .6); flash.material.opacity = fl; flash.scale.setScalar(6 + fl * 6 + Math.sin(rt * 9) * .4);
      move(tokY, t, B[4] + 2.4, B[4] + 3.4, B[5], t > B[4] + 2 ? 1 : 0);
      tokY.b.g.scale.setScalar(t < B[4] + 2.4 ? .2 + .8 * ease(win(t, B[4] + 2, B[4] + 2.4)) : 1);
      ring.set(hold(t, B[4] + 2, B[7] + 2, .6, .6), rt);
      owed.set(top(P.issY), t > B[4] + 2.2 && t < B[7] + 1.95 ? ease(win(t, B[4] + 2.2, B[4] + 2.7)) * (.72 + .28 * Math.sin(rt * 3)) : 0, 1);
      move(repay, t, B[5] + .3, B[5] + 1.9, B[6], t > B[5] + .3 && t < B[6] + .3 ? 1 : 0);
      move(redeem, t, B[6] + .3, B[6] + 1.3, B[7], t > B[6] + .3 && t < B[6] + 1.6 ? 1 : 0);
      redeem.b.g.scale.setScalar(1 - .8 * ease(win(t, B[6] + 1.3, B[6] + 1.6)));
      burn.set(ease(win(t, B[6] + 1.4, B[6] + 2.2)), hold(t, B[6] + 1.4, B[6] + 2.9, .2, .4), ease(win(t, B[6] + 2.2, B[6] + 2.9))); burn.hit(win(t, B[6] + 2.2, B[6] + 2.9));
      move(rel, t, B[6] + 2.5, B[6] + 3.6, B[7], t > B[6] + 2.2 && t < B[7] + .3 ? ease(win(t, B[6] + 2.2, B[6] + 2.5)) : 0);
      move(settle, t, B[7] + .3, B[7] + 1.9, B[8], t > B[7] + .3 ? 1 : 0);
      const hi = hold(t, B[7] + 1.9, B[7] + 2.3, .2, .6); hitY.material.opacity = hi; hitY.scale.setScalar(5 + hi * 5);
      backing.set(ease(win(t, B[7] + 2, B[7] + 3)), hold(t, B[7] + 2, D + 9, .3, .5) * (.85 + .15 * Math.sin(rt * 2.4)));
    },
  };
}
