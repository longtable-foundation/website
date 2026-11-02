// Slide 07: announcement + atomic onchain RFQ trade, settled post-trade
export default function rfq(kit, h) {
  const { win, ease, hold, C } = h;
  const B = [0, 3, 6, 8.8, 13, 16, 19, 22.4, 27.4, 30.6], D = 33.8;
  const P = { taker: [-13, 0, 2], router: [-5, 0, 2], mA: [1.6, 0, -2.6], mB: [3, 0, 2], mC: [4.4, 0, 6.4], itn: [12, 0, 2], mm: [3, -8, 2], iss: [12, -8, 2], ex: [-8, -8, 2] };
  kit.dust();
  const up = kit.plane({ y: 0, w: 34, d: 15, color: C.token, label: 'ONCHAIN · TIME T', labelColor: '#F8D028' });
  const lo = kit.plane({ y: -8, w: 34, d: 15, color: C.share, label: 'ALPACA LEDGER · POST-TRADE', labelColor: '#7FB0EE' });
  const N = {
    taker: kit.node({ pos: P.taker, label: 'Taker' }),
    router: kit.node({ pos: P.router, w: 3, d: 3, label: 'RFQ router' }),
    mA: kit.node({ pos: P.mA, w: 2, d: 2 }),
    mB: kit.node({ pos: P.mB, w: 2, d: 2, label: 'Makers' }),
    mC: kit.node({ pos: P.mC, w: 2, d: 2 }),
    itn: kit.node({ pos: P.itn, w: 3.2, d: 3.2, color: C.token, label: 'ITN smart contract' }),
    mm: kit.node({ pos: P.mm, w: 2.6, d: 2.6, color: C.share, label: 'Maker account' }),
    iss: kit.node({ pos: P.iss, w: 2.6, d: 2.6, color: C.share, label: 'Issuer account' }),
    ex: kit.node({ pos: P.ex, w: 2.6, d: 2.6, color: C.share, label: 'Exchange' }),
  };
  const top = (p, k = 0) => [p[0], p[1] + .56 + k * .36, p[2]];
  const msg = (a, b, lift) => kit.flow(top(a, -1), top(b, -1), { color: C.msg, lift, r: .02 });
  const vAt = p => [p[0], 1.25, p[2]];
  const F = {
    rfq: msg(P.taker, P.router, 1.6),
    out: [P.mA, P.mB, P.mC].map(m => msg(P.router, m, 1.2)),
    back: [P.mA, P.mB, P.mC].map(m => msg(m, P.router, 2)),
    fill: kit.flow(vAt(P.mB), vAt(P.router), { color: C.msg, lift: 2.4, r: .02 }),
    call: kit.flow(vAt(P.router), vAt(P.itn), { color: C.msg, lift: 3.4, r: .02 }),
  };
  const mv = (a, b, color, shape, lift) => ({ f: kit.flow(a, b, { color, lift, r: .03 }), b: kit.block(color, shape) });
  const M = {
    lock: mv(top(P.taker), top(P.router), C.cash, 'cash', 2),
    tok: mv(top(P.itn), top(P.taker), C.token, 'token', 5.5),
    pay: mv(top(P.router), top(P.mB), C.cash, 'cash', 2.2),
    down: mv(top(P.mB), top(P.mm), C.cash, 'cash', 0),
    buy: mv(top(P.mm), top(P.ex), C.cash, 'cash', 2.2),
    shr: mv(top(P.ex), top(P.mm), C.share, 'share', 3),
    tx: mv(top(P.mm), top(P.iss), C.share, 'share', 3),
  };
  const owed = kit.block(C.share, 'share');
  const voucher = kit.block(C.msg, 'voucher', { spin: false, halo: 2 });
  const vBeam = kit.beam(top(P.mm, -1), top(P.mB, -1), { color: C.msg, r: .2 });
  const backing = kit.beam(top(P.iss, -1), top(P.itn, -1), { color: C.share, r: .26 });
  const flash = kit.spark(C.token, 10); flash.position.set(P.itn[0], 1.2, P.itn[2]);
  const hitIss = kit.spark(C.share, 9); hitIss.position.set(P.iss[0], -7, P.iss[2]);
  const ring = kit.ring([7.5, -8, 2], { rx: 7.6, rz: 4.8, label: 'GUARANTEE' });
  const atomic = kit.frame([0, 0, 0], 33.6, 14.6);
  const atomicLab = kit.note([0, 0, 7.4], 'ATOMIC', { subColor: '#F8D028', ay: '14px' });
  const move = (m, t, a, b, z, al) => { const u = ease(win(t, a, b)); m.f.heads([t > a && t < b ? u : null], .9); m.f.route(hold(t, a - .2, z) * .5); m.b.set(m.f.curve.getPoint(t < a ? 0 : u), al); };
  const q = (f, t, a, b, z) => { const u = win(t, a, b); f.heads([u > 0 && u < 1 ? ease(u) : null], 1, .8); f.route(hold(t, a - .2, z) * .55); };
  return {
    duration: D,
    headline: [0, B[1] + .5],
    beats: [
      { t: B[0], label: 'Announcement', cue: 'Last week we completed the first post-trade settlement of an atomic onchain trade. It ran on testnet, against Alpaca’s staging environment.' },
      { t: B[1], label: 'Actors', cue: 'Onchain at time T: a taker, an RFQ router, competing makers and the ITN smart contract. Underneath, Alpaca’s offchain ledger, where the share settles post-trade.' },
      { t: B[2], label: 'RFQ', cue: 'The taker locks stablecoin in the RFQ router and asks for a quote.' },
      { t: B[3], label: 'Auction', cue: 'Makers compete for the order and the best quote wins.' },
      { t: B[4], label: 'Voucher', cue: 'Alpaca signs an ITN voucher for the winning maker, so it can fill without holding the token.' },
      { t: B[5], label: 'Fill', cue: 'The maker fills through the router. The voucher travels with the fill to the ITN smart contract.' },
      { t: B[6], label: 'Atomic swap', cue: 'The contract validates the voucher and mints. In one atomic transaction the token goes to the taker and the locked stablecoin goes to the maker. The maker now owes a share, and Alpaca guarantees it (outlined share = owed).' },
      { t: B[7], label: 'Pay offchain', cue: 'The maker moves the stablecoin to its Alpaca account and uses it to buy the share.' },
      { t: B[8], label: 'Post-trade', cue: 'Alpaca’s ledger runs the post-trade ITN transaction and moves the share from the maker to the issuer.' },
      { t: B[9], label: 'Settled', cue: 'The token is fully backed. The maker never held token inventory or pre-funded the trade.' },
    ],
    camera: [
      { t: 0, pos: [0, 34, 62], target: [0, -4, 0] },
      { t: B[1] + .3, dur: 2.2, pos: [-1, 16, 42], target: [0, -3.5, 1.5] },
      { t: B[2], dur: 1.8, pos: [-11, 8.5, 25], target: [-6, -.5, 2] },
      { t: B[3], dur: 1.8, pos: [-1, 11, 33], target: [-1, -.5, 2] },
      { t: B[4], dur: 1.8, pos: [5, 5, 38], target: [3, -2.5, 2] },
      { t: B[5], dur: 1.8, pos: [0, 13, 36], target: [0, -1, 2] },
      { t: B[6], dur: 1.6, pos: [0, 12, 44], target: [0, -3, 2] },
      { t: B[7], dur: 2, pos: [3, -.5, 33], target: [3, -7.5, 2] },
      { t: B[8], dur: 1.6, pos: [6, -.5, 34], target: [6, -7.5, 2] },
      { t: B[9], dur: 2.6, pos: [0, 17, 46], target: [0, -4, 1.5] },
    ],
    update(t, rt) {
      const ap = ease(win(t, .4, 2.6)), na = ease(win(t, B[1] + 1, B[1] + 2.2)), hl = ease(win(t, B[1] + .6, B[1] + 1.2)), won = t > B[3] + 2.8;
      up.set(ap, .35 + .65 * ease(win(t, B[1] + .8, B[1] + 2)));
      lo.set(ap, .3 + .7 * ease(win(t, B[7], B[7] + 1.5)));
      up.lab.alpha *= hl; lo.lab.alpha *= hl;
      N.taker.set(na, hold(t, B[2] + .2, B[3]) * .8 + hold(t, B[6] + 2.2, B[7]) * .9);
      N.router.set(na, hold(t, B[2] + 1.4, B[4]) * .6 + hold(t, B[5] + 1.2, B[6]) * .5);
      const loser = na * (won ? 1 - .6 * ease(win(t, B[3] + 2.8, B[3] + 3.5)) : 1), auc = hold(t, B[3] + .6, B[3] + 2.8, .3, .3) * .5;
      N.mA.set(loser, auc); N.mC.set(loser, auc);
      N.mB.set(na, won ? .9 : auc, won ? C.token : null);
      N.mB.lab.set(won ? 'Maker' : 'Makers');
      N.itn.set(na, .35 + hold(t, B[5] + 2.2, B[7]) * .65 + hold(t, B[9] + .8, D + 9) * .5);
      N.mm.set(na, hold(t, B[4] + .2, B[5]) * .8 + hold(t, B[7] + 1.6, B[9]) * .7);
      N.iss.set(na, .15 + hold(t, B[8] + 1.9, D + 9) * .75);
      N.ex.set(na * .9, hold(t, B[7] + 2.8, B[8]) * .7);
      q(F.rfq, t, B[2] + 1, B[2] + 2, B[3]);
      F.out.forEach(f => q(f, t, B[3] + .3, B[3] + 1.2, B[3] + 2.8));
      F.back.forEach((f, i) => q(f, t, B[3] + 1.5 + i * .12, B[3] + 2.4 + i * .12, B[3] + 2.8));
      q(F.fill, t, B[5] + .3, B[5] + 1.3, B[6]);
      q(F.call, t, B[5] + 1.4, B[5] + 2.5, B[6]);
      move(M.lock, t, B[2] + .4, B[2] + 1.6, B[3], t > B[2] + .1 && t < B[6] + .7 ? ease(win(t, B[2] + .1, B[2] + .4)) : 0);
      vBeam.set(ease(win(t, B[4] + .6, B[4] + 1.6)), hold(t, B[4] + .6, B[4] + 2.3, .2, .4), ease(win(t, B[4] + 1.6, B[4] + 2.3))); vBeam.hit(win(t, B[4] + 1.6, B[4] + 2.3));
      let vp = vAt(P.mB);
      if (t > B[5] + .3) vp = F.fill.curve.getPoint(ease(win(t, B[5] + .3, B[5] + 1.3)));
      if (t > B[5] + 1.4) vp = F.call.curve.getPoint(ease(win(t, B[5] + 1.4, B[5] + 2.5)));
      voucher.set(vp, ease(win(t, B[4] + 1.6, B[4] + 2)) * (1 - ease(win(t, B[6], B[6] + .4))), 0, .3);
      voucher.g.rotation.y = rt * .5;
      const fl = hold(t, B[6], B[6] + .6, .25, .6); flash.material.opacity = fl; flash.scale.setScalar(6 + fl * 6 + Math.sin(rt * 9) * .4);
      move(M.tok, t, B[6] + .7, B[6] + 2.4, B[7], t > B[6] + .2 ? 1 : 0);
      M.tok.b.g.scale.setScalar(t < B[6] + .7 ? .2 + .8 * ease(win(t, B[6] + .2, B[6] + .7)) : 1);
      move(M.pay, t, B[6] + .7, B[6] + 2.4, B[7], t > B[6] + .7 && t < B[7] + .6 ? 1 : 0);
      atomic.set(hold(t, B[6] + .4, B[7])); atomicLab.alpha = hold(t, B[6] + .5, B[7]);
      ring.set(hold(t, B[6] + 1.2, B[8] + 2.2, .6, .6), rt);
      owed.set(top(P.iss), t > B[6] + 1.4 && t < B[8] + 2 ? ease(win(t, B[6] + 1.4, B[6] + 1.9)) * (.72 + .28 * Math.sin(rt * 3)) : 0, 1);
      move(M.down, t, B[7] + .6, B[7] + 1.8, B[8], t > B[7] + .6 && t < B[7] + 2 ? 1 : 0);
      move(M.buy, t, B[7] + 2, B[7] + 3, B[8], t > B[7] + 2 && t < B[7] + 3.1 ? 1 : 0);
      move(M.shr, t, B[7] + 3.2, B[7] + 4.2, B[8], t > B[7] + 3.1 && t < B[8] + .4 ? 1 : 0);
      move(M.tx, t, B[8] + .4, B[8] + 2, B[9], t > B[8] + .4 ? 1 : 0);
      const hi = hold(t, B[8] + 1.9, B[8] + 2.3, .2, .6); hitIss.material.opacity = hi; hitIss.scale.setScalar(5 + hi * 5);
      backing.set(ease(win(t, B[9] + .6, B[9] + 1.6)), hold(t, B[9] + .6, D + 9, .3, .5) * (.85 + .15 * Math.sin(rt * 2.4)));
    },
  };
}
