const cfg = require('../config');
const C = require('../content');
const { esc } = require('../layout');
const { video, link, proposalBtn, cap, stepper, hex, share } = require('../components');

const legend = items => `<div class="legend rule">${items.map(([ic, t]) => `<span>${ic}${t}</span>`).join('')}</div>`;

// FIG 3.x.1 figures (problem)
const fig1 = {
  1: u => `<div class="figw"><div class="panel scroll-x" style="padding:24px 28px 26px"><div class="rails">
<div class="days"><span></span><div><span>SAT</span><span>SUN</span><span>MON</span><span>TUE</span></div></div>
<div class="rw" style="height:70px"><span class="rl"><b>FAST RAIL</b><span>Onchain</span></span><div class="tr"><span class="line" style="top:50%"></span><span class="abs" style="left:6%;top:50%;transform:translate(-50%,-50%);display:flex">${hex()}</span><span class="abs" style="left:calc(6% + 20px);top:calc(50% + 10px);font:500 13px/1.3 var(--sans)">GMEx minted at T, Saturday morning</span></div></div>
<div class="rw" style="height:44px"><span class="eyebrow">BACKSTOP</span><div class="tr"><span class="abs" style="left:6%;right:12%;top:6px;bottom:6px;background:var(--token);border:1.5px solid var(--ink);display:flex;align-items:center;justify-content:center;font:500 11px/1 var(--mono);letter-spacing:.06em">CLEARINGHOUSE BACKSTOP · COVERS T → T+1</span></div></div>
<div class="rw" style="height:78px"><span class="rl"><b>SLOW RAIL</b><span>DTCC</span></span><div class="tr"><span class="line" style="top:40%"></span><span class="abs" style="left:0;width:50%;top:calc(40% - 12px);height:24px;background:repeating-linear-gradient(135deg,#d6d6d6 0 6px,#efefef 6px 12px);border:1px solid var(--muted);display:flex;align-items:center;padding-left:10px;font:500 11px/1 var(--mono);letter-spacing:.04em;white-space:nowrap;overflow:hidden">CLOSED · LOANNET &amp; DTCC DARK ALL WEEKEND</span><span class="abs" style="left:88%;top:40%;transform:translate(-50%,-50%);display:flex"><span class="shr" style="width:28px;height:18px"></span></span><span class="abs" style="right:0;top:calc(40% + 14px);font:500 13px/1.3 var(--sans)">GME delivers T+1, Tuesday</span></div></div>
${legend([[hex('s'), 'Token'], [share(), 'Share'], ['<span class="sw"></span>', 'Clearinghouse backstop']])}
</div></div>${cap('FIG. 3.1.1', u.cap1)}</div>`,

  2: u => `<div class="figw"><div class="panel" data-mesh>
<div class="panel-h" style="padding:14px 20px"><span class="eyebrow ink">Settlement agents on one ATS</span><label class="range"><span>n = <span data-n>5</span></span><input type="range" min="3" max="8" step="1" value="5" aria-label="Number of settlement agents"></label></div>
<div class="two c">
<div><div class="hd"><span class="eyebrow">Bilateral</span><span class="big" style="font-size:32px"><span data-sub>20</span><small>sub-accounts</small></span></div><div class="mesh" data-bil></div></div>
<div><div class="hd"><span class="eyebrow">Cleared · one ledger</span><span class="big" style="font-size:32px"><span data-n2>5</span><small>accounts</small></span></div><div class="mesh" data-hub></div></div>
</div></div>${cap('FIG. 3.2.1', u.cap1)}</div>`,

  3: () => stepper({ scene: 'prefund', fig: 'FIG. 3.3.1', title: 'Without clearing, market makers pre-fund every venue' }),

  4: u => `<div class="figw"><div class="panel scroll-x" style="padding:24px 28px"><div class="drs">
<div class="g"><div class="lbls"><div style="height:64px"><b>DRS triggered</b><span>Title leaves Cede &amp; Co</span></div><div style="height:64px"><b>DRS black box</b><span>DTCC hours only · SLA in days</span></div><div style="height:64px"><b>Token mint</b><span>Waits… and waits</span></div></div>
<div style="position:relative;height:192px"><span class="abs" style="left:0;top:0;bottom:0;border-left:1px dashed var(--muted)"></span><span class="abs" style="left:0;top:32px;transform:translate(-50%,-50%);display:flex"><span class="shr" style="width:24px;height:16px"></span></span><span class="abs" style="left:0;width:80%;top:84px;height:24px;background:repeating-linear-gradient(90deg,#111 0 36px,#d9d9d9 36px 108px)"></span><span class="abs" style="left:0;width:84%;top:160px;border-top:1.5px dotted var(--muted)"></span><span class="abs mintc" style="left:84%;top:160px;transform:translate(-50%,-50%)">MINT</span></div></div>
<div class="g" style="margin-top:14px"><span></span><div class="axis"><span>T</span><span>DAYS LATER →</span></div></div>
<div class="legend rule" style="margin-top:16px"><span>${share()}Share title</span><span>${hex('s')}Token mint</span></div>
</div></div>${cap('FIG. 3.4.1', u.cap1)}</div>`,

  5: () => stepper({ scene: 'rfq', fig: 'FIG. 3.5.1', title: 'How an atomic onchain trade settles post-trade', skip: 1 }),
  6: () => stepper({ scene: 'bridge', fig: 'FIG. 3.6.1', title: 'Cross-chain clearing, with Across' }),
};

// FIG 3.x.2 figures (goal)
const fig2 = {
  1: u => `<div class="figw"><div class="panel scroll-x" style="padding:24px"><div class="ia">
<div class="agencies"><span>NSCC</span><span>OCC</span><span>FICC</span><span>CFTC licensed DCOs</span></div>
<div class="ticks"><span></span><span></span><span></span><span></span></div>
<div class="shared"><b>INTER-AGENCY AGREEMENT · SHARED CREDITS</b><span>Members of one agency can use their credits in another.</span></div>
<div class="g5"><span></span><span></span><span class="vline"><span class="numc">01</span></span><span></span><span></span></div>
<div class="g5" style="align-items:stretch">
<div class="box"><small>CLEARING MEMBER</small><b>ABN AMRO</b></div>
<span class="hline"><span class="numc">03</span></span>
<div class="ch"><b>Clearinghouse</b><small>UNDERWRITES THE MINT AT T</small></div>
<span class="hline"><span class="numc">02</span></span>
<div class="box"><small>CLEARING MEMBER</small><b>Alpaca</b></div>
</div>
<div class="g5"><span></span><span></span><span class="vline"><span class="numc">05</span></span><span></span><span class="vline"><span class="numc">04</span></span></div>
<div class="g5"><span></span><span></span><div class="box bs"><small>BACKSTOP</small><b>Lines of credit</b></div><span></span><div class="box fo"><small>FAIL OBLIGATION</small><b>DTC box</b></div></div>
<div class="legend rule" style="margin-top:16px"><span><span class="sw"></span>Clearinghouse</span><span><span class="sw soft"></span>Backstop</span><span><span class="sw owed"></span>Fail obligation (owed share)</span></div>
</div></div>${cap('FIG. 3.1.2', u.cap2)}
<div class="goals">${C.GOAL1.map((t, i) => `<div><span class="numc">${String(i + 1).padStart(2, '0')}</span><span>${t}</span></div>`).join('')}</div></div>`,

  2: u => `<div class="figw"><div class="dues" data-dues>
<div class="top"><span>NET DUES · CYCLE <span data-cyc>1</span> OF 3</span><span>PUBLISHED <span data-cycclose>08:00</span> UTC · ILLUSTRATIVE</span></div>
<div class="r h"><span>AGENT</span><span><span>← PAYS</span><span>RECEIVES →</span></span><span style="text-align:right">NET</span></div>
${C.DUES.map(([c, a, l, w, k]) => `<div class="r"><span class="c">${c}</span><span class="b"><i style="left:${l}%;width:${w}%;${k === 'r' ? 'background:var(--cash)' : k === 'p' ? 'border:2px solid var(--cash)' : 'border:1px dashed #8f8f8f'}"></i></span><span class="a">${a}</span></div>`).join('')}
</div>${cap('FIG. 3.2.2', u.cap2)}</div>`,

  3: u => `<div class="figw"><div class="panel pad24" style="display:flex;flex-direction:column;gap:14px">
<div class="flow3">
<div><span class="k">01 · AT T</span><span class="ic"><span class="claim"></span><span class="coin">$</span></span><b>Trade at T: claim delivered</b><span class="d">Cash proceeds in</span></div>
<span aria-hidden="true">→</span>
<div><span class="k">02 · THROUGH THE CYCLE</span><span class="ic"><span class="claim"></span><span class="netpill">NET</span><span class="claim"></span></span><b>Net through cycle</b><span class="d">Obligations offset</span></div>
<span aria-hidden="true">→</span>
<div><span class="k">03 · CYCLE END</span><span class="ic"><span class="coin">$</span><span class="mono" style="font-size:13px">→</span>${share('l')}</span><b>Settle with proceeds</b><span class="d">Claim redeems for netted shares</span></div>
</div>
<div class="ystrip">OPEN SOURCE SOLVER · BACKED BY A CLEARINGHOUSE</div>
<span class="plus"><i>+</i>Positive working capital</span>
<div class="legend" style="padding-top:12px;border-top:1px solid var(--line-2)"><span><span class="claim s"></span>Claim</span><span><span class="coin s"></span>Stablecoin</span><span>${share()}Share</span><span><span class="sw"></span>Clearinghouse</span></div>
</div>${cap('FIG. 3.3.2', u.cap2)}</div>`,

  4: u => `<div class="figw"><div class="panel scroll-x" style="padding:24px 28px"><div class="drs after">
<div class="g"><div class="lbls"><div style="height:56px"><b>DRS triggered</b><span>Title leaves Cede &amp; Co</span></div><div style="height:56px"><b>Clearinghouse underwrites instantly</b></div><div style="height:56px"><b>Mint at time T</b><span>On the clearinghouse’s backstop</span></div><div style="height:56px"><b>DRS completes…</b><span>Whenever</span></div></div>
<div style="position:relative;height:224px"><span class="abs" style="left:0;top:0;bottom:0;border-left:1px dashed var(--muted)"></span><span class="abs" style="left:-8px;top:12px;width:16px;height:146px;background:var(--token);border:1.5px solid var(--ink)"></span><span class="abs" style="left:0;top:28px;transform:translate(-50%,-50%);width:8px;height:8px;border-radius:50%;background:var(--ink)"></span><span class="abs" style="left:0;top:84px;transform:translate(-50%,-50%);width:8px;height:8px;background:var(--ink)"></span><span class="abs mintc" style="left:0;top:140px;transform:translate(-50%,-50%)">MINT</span><span class="abs" style="left:0;width:80%;top:182px;height:28px;border:1.5px dashed var(--ink);background:rgba(127,176,238,.25);display:flex;align-items:center;padding-left:28px;font:500 11px/1 var(--mono);letter-spacing:.06em;white-space:nowrap">POST-TRADE IMPLEMENTATION DETAIL</span></div></div>
<div class="g" style="margin-top:14px"><span></span><div class="axis"><span>T</span><span>DAYS LATER →</span></div></div>
<div class="legend rule" style="margin-top:16px"><span><span class="sw"></span>Clearinghouse underwrites at T</span><span>${hex('s')}Token mint</span><span><span class="sw owed"></span>Share settles post-trade</span></div>
</div></div>${cap('FIG. 3.4.2', u.cap2)}</div>`,
};

module.exports = function usecase(i) {
  const u = C.UC[i], k = i + 1, n = C.UC.length;
  const prev = i ? C.UC[i - 1] : null, next = i < n - 1 ? C.UC[i + 1] : null;
  const nav = C.UC.map((x, j) => `<a class="it" href="/use-cases/${x.slug}/"${j === i ? ' aria-current="page"' : ''}><span>${x.n}</span><span>${x.t}</span></a>`).join('');
  const videoId = u.video ? cfg.videos[u.video] : null;

  const prob = u.quote
    ? `<blockquote class="quote"><span>${u.prob}</span>${cfg.links[u.qLink] ? `<a class="eyebrow" href="${esc(cfg.links[u.qLink])}" target="_blank" rel="noopener">${u.qa} · Watch the clip ↗</a>` : `<span class="eyebrow" style="font-size:11px;letter-spacing:.06em;font-weight:500">${u.qa}</span>`}</blockquote>`
    : `<p class="prob">${u.prob}</p>`;

  const body = `<div class="uc">
<aside aria-label="Use cases">
<span class="eyebrow">§3 Use cases</span>
${nav}
<a class="pp" href="${esc(cfg.proposal.href)}" data-proposal><span class="eyebrow" style="margin:0">In the proposal</span><b>pp. ${u.pp} · PDF by email →</b></a>
</aside>
<div class="main">
<a class="eyebrow back" href="/#use-cases">← §3 Use cases · ${u.n} of 06</a>
<div class="hd"><span class="eyebrow">§3.${k} · Use case ${u.n} of 06</span><h1 class="h1 page">${u.t}</h1><span class="s">${u.s}</span><div class="chips">${u.p.map(p => `<span class="chip">${p}</span>`).join('')}</div></div>
${u.video ? video({ id: videoId, label: `Use case ${u.n} bitesize explainer` }) : ''}
<div class="blk"><span class="lab">§3.${k}.1 · Problem</span>${prob}</div>
${fig1[k](u)}
<div class="blk" style="gap:18px"><span class="lab">§3.${k}.2 · The goal</span>${u.goal.map(g => `<p class="goal">${g}</p>`).join('')}</div>
${fig2[k] ? fig2[k](u) : ''}
${u.mile ? `<a class="mile" href="/#roadmap"><span class="k">${u.mile[0]}</span><span><b>${u.mile[1]}</b><span class="d">${u.mile[2]}</span></span><span class="go">Roadmap →</span></a>` : ''}
<div class="btn-row">${proposalBtn()}<a class="btn-o" href="/get-involved/">Get involved</a></div>
<nav class="pn" aria-label="Previous and next">
<a href="${prev ? `/use-cases/${prev.slug}/` : '/'}"><span class="k">← ${prev ? `PREVIOUS · §3.${k - 1}` : 'HOME'}</span><b>${prev ? `${prev.n} ${prev.t}` : 'Longtable Foundation'}</b></a>
<a href="${next ? `/use-cases/${next.slug}/` : '/get-involved/'}"><span class="k">${next ? `NEXT · §3.${k + 1}` : 'NEXT'} →</span><b>${next ? `${next.n} ${next.t}` : 'Get involved'}</b></a>
</nav>
</div>
</div>`;

  return {
    title: `Use case ${u.n}: ${u.t}`,
    description: u.d,
    doc: `LT-0001 · §3.${k} · Use case ${u.n}`,
    docShort: `LT-0001 · §3.${k}`,
    active: 'use-cases',
    compactFooter: true,
    body,
  };
};
