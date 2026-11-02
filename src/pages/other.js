const cfg = require('../config');
const C = require('../content');
const { esc, ext } = require('../layout');
const { video, link, proposalCard } = require('../components');

const secL = (no, nm) => `<div class="sec-l"><span class="no">${no}</span><span class="nm">${nm}</span></div>`;

function signatories() {
  const body = `<section class="sec first">
${secL('§7', 'Signatories')}
<div class="col g20"><h1 class="h1 page">Signatories</h1><p class="lead">Founding signatories of the Longtable Initiative statement of intent.</p></div>
</section>
<section class="sec flush" style="padding-bottom:64px">
${secL('§7.1', 'Founding signatories')}
<div class="col" style="gap:16px">
<div class="sig3">${cfg.signatories.map(g => `<div><div class="logo${g.logo ? ' img' : ''}">${g.logo ? `<img src="${esc(g.logo)}" alt="${esc(g.name)} logo">` : 'LOGO'}</div><div class="nm"><b>${esc(g.name)}</b><span>FOUNDING SIGNATORY</span></div></div>`).join('')}</div>
<a class="dash-cta" href="/get-involved/?path=join"><span><b>Your organization</b><span class="d">Membership is open to issuers, clearing members, venues, vaults, oracles and CSDs.</span></span><span class="u">Become a signatory →</span></a>
</div>
</section>
<section class="sec end">
${secL('§7.2', 'Signing')}
<div class="cards2 w" style="max-width:940px">
<div class="dcard"><span class="eyebrow">Statement of intent</span><span class="tt">Become a signatory</span><p>Foundation membership must be open for any new issuers to join while keeping out bad actors.</p><a class="wbtn" href="/get-involved/?path=join">Request the statement of intent</a></div>
<div class="lcard"><span class="eyebrow">Press</span><span class="tt">Covering the initiative?</span><p>Media inquiries are handled by the Alpaca media team.</p><a class="u" href="/press/">Press page →</a></div>
</div>
</section>`;
  return { title: 'Signatories', description: 'Founding signatories of the Longtable Initiative statement of intent.', doc: 'LT-0001 · §7 · Signatories', docShort: 'LT-0001 · §7', active: 'signatories', body };
}

function about() {
  const kv = [['Incubator', 'Alpaca'], ['Reference impl.', 'Alpaca'], ['Phase 1 backstop', 'Alpaca'], ['Legal status', 'Legally independent'], ['Funding', 'Member dues'], ['Protocol IP', 'Irrevocable open source license'], ['Governance', 'To be announced']];
  const body = `<section class="sec first" style="padding-bottom:64px">
${secL('Appendix A', 'About')}
<div class="col g20"><h1 class="h1 page">About the Longtable Foundation</h1><p class="lead" style="max-width:760px">Longtable is incubated by Alpaca. The Foundation is legally independent, funded by member dues, and holds the protocol IP under an irrevocable open source license.</p></div>
</section>
<section class="sec">
${secL('A.1', 'Why now')}
<div class="why">
<div><span class="n">01</span><b>It is now Day 2 for tokenized stocks</b><p>Custody was the foundation and was the necessary first step for the industry. For bearer crypto tokens this is where the story ends, but tokenized equities are different. We are now entering a new era of “onchain credit”, which for tokenized equities means post-trade settlement, which requires clearing.</p></div>
<div><span class="n">02</span><b>The need for clearing has not been well understood</b><p>Crypto is typically instantly and atomically settled, and atomic settlement works fine when both legs of the trade are pre-funded. There is no concept of post-trade settlement on any tokenized equities trading venue today, so there was no need for a multimodal clearinghouse until tradfi institutional adoption entered the zeitgeist.</p></div>
<div><span class="n">03</span><b>Every new clearinghouse needs to beat the chicken &amp; egg problem</b><p>Most fail due to not achieving critical mass. Alpaca’s ITN is the only example that has beaten the chicken &amp; egg problem.</p></div>
</div>
</section>
<section class="sec">
${secL('A.2', 'Incubation')}
<div class="inc">
<div class="l"><h2 class="h2">Incubated by Alpaca</h2><p>Today, Alpaca has built an internal clearinghouse, ITN (Instant Tokenization Network), as an MVP of how post-trade settlement and clearing can work for tokenized equities.</p><p>ITN can be considered the world’s first ever implementation of tokenized stocks clearing, but it only works where both issuer and minting participant custody the traditional asset at Alpaca. A closed system.</p><p class="pull">Interestingly, this is exactly how the NSCC started, as a single-venue clearinghouse inside the NYSE.</p></div>
<div class="panel kv"><div class="hd eyebrow">Foundation · at a glance</div>${kv.map(([a, b]) => `<div class="r"><span>${a}</span><span>${b}</span></div>`).join('')}</div>
</div>
</section>
<section class="sec">
${secL('A.3', 'Membership')}
<div class="mem">
<div class="numlist">
<div><span>01</span><span>All ITN issuers are invited as Longtable Foundation members to come to an agreement on token minting standards.</span></div>
<div><span>02</span><span>Members may donate open source software to the Foundation under an irrevocable license.</span></div>
<div><span>03</span><span>Foundation membership must be open for any new issuers to join while keeping out bad actors.</span></div>
</div>
<div class="classes"><span class="eyebrow">Member classes</span><div class="ls">${C.MCL.map(m => `<span>${m}s</span>`).join('').replace('CSDs', 'CSDs')}</div><a class="u" style="margin-top:6px" href="/get-involved/?path=join">Apply to join →</a></div>
</div>
</section>
<section class="sec end">
${secL('A.4', 'Contact')}
<div class="cards2" style="max-width:940px">
<a class="lcard p24" href="/get-involved/"><span class="eyebrow">Partnerships</span><span class="tt">Join, fund or contribute</span><span class="u" style="margin-top:8px;text-decoration:none">Get involved →</span></a>
<div class="lcard p24"><span class="eyebrow">Press</span><span class="tt">Alpaca media team</span><a class="em" href="mailto:${esc(cfg.pressEmail)}">${esc(cfg.pressEmail)}</a><a class="u" style="margin-top:8px;text-decoration:none" href="/press/">Press page →</a></div>
</div>
</section>`;
  return { title: 'About', description: 'Longtable is incubated by Alpaca. The Foundation is legally independent, funded by member dues, and holds the protocol IP under an irrevocable open source license.', doc: 'LT-0001 · Appendix A · About', docShort: 'LT-0001 · App. A', active: 'about', body };
}

function press() {
  const v = cfg.videos;
  const chapStart = ts => { const [m, s] = ts.split(':').map(Number); return m * 60 + s; };
  const body = `<section class="sec first" style="padding-bottom:64px">
${secL('Appendix B', 'Press')}
<div class="col"><h1 class="h1 page">Press</h1><p class="lead">Media inquiries are handled by the Alpaca media team.</p>
<div class="presskeys">
<div><span class="eyebrow">Media contact</span><b>Alpaca media team</b><a class="em" href="mailto:${esc(cfg.pressEmail)}">${esc(cfg.pressEmail)}</a></div>
<div><span class="eyebrow">Press kit</span><b>Logos, proposal, boilerplate</b><a class="u" href="/assets/longtable-press-kit.zip" download>Download ZIP ↓</a></div>
<div><span class="eyebrow">Speaker</span><b>${esc(cfg.speaker.name)}</b><span class="r">${esc(cfg.speaker.role)}</span></div>
</div></div>
</section>
<section class="sec" id="talks">
${secL('B.1', 'Talks &amp; interviews')}
<div class="col" style="gap:48px">
<div class="talk">
${video({ id: v.summitTalk, label: 'Summit talk', dur: '7 MIN', small: true })}
<div class="meta"><span class="eyebrow">The Alpaca Summit · October 2026</span><b>Multimodal Clearing</b><span class="by">${esc(cfg.speaker.name)}, ${esc(cfg.speaker.role)}</span>${v.summitTalk ? link('https://www.youtube.com/watch?v=' + v.summitTalk, 'Watch on YouTube ↗') : ''}</div>
</div>
<div class="talk" data-chapters data-yt="${esc(v.rollupInterview)}">
<div class="l">
<div data-chapvid>${video({ id: v.rollupInterview, label: 'The Rollup interview', dur: `STARTS AT ${C.CH[4][0]} · ${C.CH[4][1]}`, durLeft: true, small: true, start: chapStart(C.CH[4][0]) })}</div>
<span class="eyebrow">The Rollup · Live from DAS Asia 2026</span><span class="ttl">Introducing “Multimodal” Equities</span><p class="body-s">Equities now exist in many forms simultaneously, only a multimodal clearinghouse can solve liquidity across all modalities while preserving capital efficiency.</p>
</div>
<div class="panel chaps"><div class="hd"><span>CHAPTERS</span><span>PICK ONE</span></div>${C.CH.map(([ts, t], i) => `<button type="button" aria-pressed="${i === 4}" data-ts="${ts}" data-s="${chapStart(ts)}" data-t="${esc(t)}"><span>${ts}</span><span>${t}</span></button>`).join('')}</div>
</div>
<div class="qband"><div><span class="eyebrow">SIFMA Ops 2026</span><p class="q">“Crypto technology allows pre-funded trades to settle atomically… but that’s not how trading works in the real world. Nobody wants to pre-fund their trades.”</p></div><div class="ls">${link(cfg.links.sifmaClip1, 'Watch clip [1] ↗')}${link(cfg.links.sifmaClip2, 'Watch clip [2] ↗')}</div></div>
</div>
</section>
<section class="sec">
${secL('B.2', 'Boilerplate')}
<div class="col" style="gap:14px"><div class="boiler"><span class="eyebrow">About the Longtable Foundation</span><p data-boiler>${C.BOILER}</p><button class="btn-sm" type="button" data-copy>Copy text</button></div></div>
</section>
<section class="sec">
${secL('B.3', 'Key figures')}
<div class="stats four" style="max-width:940px">
<div class="stat"><span class="v">$300T</span><span class="l">Global equities market</span></div>
<div class="stat"><span class="v">$100T</span><span class="l">In assets custodied at the DTC</span></div>
<div class="stat"><span class="v">$4.6<small>quadrillion</small></span><span class="l">In trades cleared every year by the NSCC</span></div>
<div class="stat"><span class="v">98%</span><span class="l">Of US equity trades are netted down</span></div>
</div>
</section>
<section class="sec end">
${secL('B.4', 'Further reading')}
<div class="reading">
${[[cfg.links.tabbArticle, 'Equity Tokens Need Netting Not Instant Settlement', 'Larry Tabb, Bloomberg Intelligence · May 20, 2026'], [cfg.links.taylorArticle, 'Netting is All You Need', 'Simon Taylor, Tempo Blockchain · Aug 7, 2026']].map(([h, t, b]) => h ? `<a ${ext(h)}><span><b>${t}</b><span class="by">${b}</span></span><span class="ar">↗</span></a>` : `<div><span><b>${t}</b><span class="by">${b}</span></span><span></span></div>`).join('')}
</div>
</section>`;
  return { title: 'Press', description: 'Press resources for the Longtable Foundation. Media inquiries are handled by the Alpaca media team.', doc: 'LT-0001 · Appendix B · Press', docShort: 'LT-0001 · App. B', active: 'press', body };
}

function getInvolved() {
  const roleOpts = C.ROLES.map(r => `<option>${r}</option>`).join('');
  const hp = '<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">';
  const body = `<section class="sec first" style="padding-bottom:48px">
${secL('§8', 'Get involved')}
<div class="col g20"><h1 class="h1 page">Get involved</h1><p class="lead">Follow our progress, join the initiative, help fund the Foundation or contribute open source code.</p></div>
</section>
<section class="sec flush" style="padding-bottom:64px">
${secL('§8.1', 'Choose a path')}
<div class="paths" data-paths>
<div class="opts" role="tablist" aria-label="Ways to get involved">${C.INT.map((x, i) => `<button class="opt" type="button" role="tab" id="tab-${x.id}" aria-controls="pane-${x.id}" aria-selected="${i === 0}" data-path="${x.id}"><span class="k">${x.k}</span><b>${x.t}</b><span class="d">${x.d}</span></button>`).join('')}</div>
<div class="pform">
<form class="pane" id="pane-follow" role="tabpanel" aria-labelledby="tab-follow" data-form="follow" novalidate>${hp}
<span class="tt">Get progress updates</span><span class="ds">Milestones, publications and open calls for comment.</span>
<label><span>WORK EMAIL</span><input class="field" type="email" name="email" required placeholder="name@organization.com" autocomplete="email"></label>
<label><span>I AM A…</span><select class="field" name="role">${roleOpts}</select></label>
<button class="btn" type="submit">Subscribe</button><span class="note" data-msg>Milestones and publications only. Unsubscribe any time.</span>
</form>
<form class="pane" id="pane-join" role="tabpanel" aria-labelledby="tab-join" data-form="join" novalidate hidden>${hp}
<span class="tt">Join the initiative</span>
<div class="g2"><label><span>ORGANIZATION</span><input class="field" name="organization" required autocomplete="organization"></label><label><span>WORK EMAIL</span><input class="field" type="email" name="email" required autocomplete="email"></label></div>
<fieldset style="border:0;padding:0;margin:0;display:flex;flex-direction:column;gap:10px"><legend class="fl" style="padding:0;margin-bottom:10px">MEMBER CLASS</legend><div class="pills">${C.MCL.map((c, i) => `<label><input type="radio" name="memberClass" value="${c}"${i === 0 ? ' checked' : ''}><span>${c}</span></label>`).join('')}</div></fieldset>
<label><span>JURISDICTION</span><select class="field" name="jurisdiction"><option>United States</option><option>European Union</option><option>United Kingdom</option><option>ADGM</option><option>Other</option></select></label>
<button class="btn" type="submit">Submit application</button><span class="note" data-msg></span>
</form>
<form class="pane" id="pane-fund" role="tabpanel" aria-labelledby="tab-fund" data-form="fund" novalidate hidden>${hp}
<span class="tt">Help fund the Foundation</span><span class="ds">The Foundation is funded by member dues. Governance and funding details are to be announced.</span>
<div class="g2"><label><span>ORGANIZATION</span><input class="field" name="organization" required autocomplete="organization"></label><label><span>WORK EMAIL</span><input class="field" type="email" name="email" required autocomplete="email"></label></div>
<label><span>MESSAGE</span><textarea class="field" name="message" rows="4"></textarea></label>
<button class="btn" type="submit">Start a conversation</button><span class="note" data-msg></span>
</form>
<div class="pane" id="pane-build" role="tabpanel" aria-labelledby="tab-build" hidden>
<span class="tt">Contribute open source code</span>
<p class="body-s">Members contribute this software under the irrevocable license so participants can trust that it is a protocol they can build their business on without fear of it being taken away.</p>
<div class="tree"><div>${esc(cfg.githubUrl.replace(/^https?:\/\//, ''))}</div><div>├── solvers/        1inch Fusion · LI.FI · Across · 0x · CoW Swap</div><div>└── vault-adapters/ Aave v4 · Gauntlet Aera · Morpho</div></div>
<div class="btn-row" style="gap:10px"><a class="btn" style="height:46px;padding:0 20px" ${ext(cfg.githubUrl)}>Open GitHub ↗</a><a class="btn-o" style="height:46px;padding:0 20px" ${ext(cfg.contributingUrl)}>Contribution guide</a></div>
</div>
<div class="done" data-done hidden tabindex="-1"><span class="ok" aria-hidden="true">✓</span><span class="tt">Thank you</span><span class="ds">We’ll be in touch at the email you provided.</span><button class="btn-sm" type="button" data-reset>Back to the form</button></div>
</div>
</div>
</section>
<section class="sec end">
${secL('§8.2', 'Read first')}
<div class="cards2 w" style="max-width:940px">
${proposalCard()}
<a class="boxlink" href="/use-cases/01/"><span class="eyebrow">§3 · Use cases</span><b>Six use cases, step by step</b><span class="go">Start with use case 01 →</span></a>
</div>
</section>`;
  return { title: 'Get involved', description: 'Follow our progress, join the initiative, help fund the Foundation or contribute open source code.', doc: 'LT-0001 · §8 · Get involved', docShort: 'LT-0001 · §8', active: 'get-involved', body };
}

function notFound() {
  const body = `<section class="sec first end">
${secL('404', 'Not found')}
<div class="col g20"><h1 class="h1 page">This page does not exist.</h1><p class="lead">The link may be old or mistyped.</p><div class="btn-row"><a class="btn" href="/">Go to the home page</a><a class="btn-o" href="/use-cases/01/">Read the use cases</a></div></div>
</section>`;
  return { title: 'Page not found', doc: 'LT-0001 · 404', docShort: 'LT-0001 · 404', active: '', body };
}

module.exports = { signatories, about, press, getInvolved, notFound };
