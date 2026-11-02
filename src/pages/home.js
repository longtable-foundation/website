const cfg = require('../config');
const C = require('../content');
const { esc, ext } = require('../layout');
const { video, proposalBtn, proposalCard, cap, stepper, hex, share } = require('../components');

const secL = (no, nm) => `<div class="sec-l"><span class="no">${no}</span><span class="nm">${nm}</span></div>`;

module.exports = function home() {
  const hero = `<section class="hero">
<div class="l">
<span class="eyebrow m-docline">LT-0001 · Draft for comment</span>
<div class="docmeta"><span class="k">Document</span><span>LT-0001 · Multimodal Clearing</span><span class="k">Status</span><span>Draft for comment</span><span class="k">Updated</span><span>29 October 2026</span></div>
<h1 class="h1">An open standard for clearing tokenized equities.</h1>
<div class="abstract"><span class="eyebrow">Abstract</span><p>Longtable is a foundation and a global network of clearinghouses that use open source technology for post-trade settlement of tokenized equities, onchain and offchain.</p></div>
<div class="btn-row">${proposalBtn()}<a class="btn-o" href="/get-involved/">Get updates</a></div>
</div>
<figure>
${video({ id: cfg.videos.summitTalk, label: 'Alpaca Summit 2026 talk', dur: '7 MIN' })}
<figcaption><span><span class="figno">FIG. 0</span>Multimodal Clearing. ${esc(cfg.speaker.name)} at The Alpaca Summit, October 2026.</span>${cfg.videos.summitTalk ? `<a ${ext('https://www.youtube.com/watch?v=' + cfg.videos.summitTalk)}>Watch on YouTube ↗</a>` : ''}</figcaption>
</figure>
</section>`;

  const problem = `<section class="sec" id="problem">
${secL('§1', 'The problem')}
<div class="col">
<h2 class="h2">Tokenized assets are not bearer assets like crypto tokens. They are a new modality for the same underlying asset.</h2>
<div class="panel modal">
<span class="pill-dark">One economic exposure · the same underlying share</span>
<div class="mods">
<div class="mod"><span class="ic">${share('l')}</span><span class="t">Traditional share</span><span class="d">Regulated securities custody</span></div>
<div class="mod"><span class="ne" aria-hidden="true">≠</span><span class="ic">${hex()}</span><span class="t">Issuer-sponsored token</span><span class="d">Issuer-authorized register</span></div>
<div class="mod"><span class="ne" aria-hidden="true">≠</span><span class="ic"><span class="combo">${hex()}${share()}</span></span><span class="t">Custodial token</span><span class="d">Shares at a regulated custodian</span></div>
<div class="mod"><span class="ne" aria-hidden="true">≠</span><span class="ic"><span class="spv">${hex('m')}</span></span><span class="t">Linked security token</span><span class="d">SPV holds the underlying</span></div>
</div>
<div class="legend"><span>${hex('s')}Token</span><span>${share()}Share</span></div>
<div class="dashed-note">No common clearing mechanism · not automatically fungible</div>
</div>
${cap('FIG. 1', 'Bilateral agreements can allow a participant to exchange a specific token for its underlying traditional share. They do not create general settlement interoperability among every token format, issuer, custodian, venue and counterparty.')}
<div class="blk">
<p class="statement">Equity markets run on credit. Onchain markets run on a debit card.</p>
<p class="body-l">When a broker buys a share, nobody pays at the moment of the trade. The clearinghouse guarantees the trade, nets each member’s buys against its sells, and only the difference settles a day later. A market maker can sell first and source the share before settlement. That is how the NSCC clears $4.6 quadrillion of trades a year without anyone holding $4.6 quadrillion.</p>
<p class="body-l">Tokenized equities settle the other way. A blockchain trade is atomic: the token and the stablecoin change hands in the same transaction, or not at all. There is no credit and no later. The seller must already hold the token and the buyer must already hold the cash. That is pre-funding.</p>
</div>
<div class="blk">
<p class="statement">Pre-funding $4.6 quadrillion of trading flow a year is impossible.</p>
<p class="body-l">On a pre-funded ATS, a market maker has to buy the token before it can quote the offer. On onchain RFQ, the solver must deliver the token at trade time. Either way the inventory is bought up front, before any customer has asked for it. No serious institution will pre-fund a year’s flow at that scale.</p>
<p class="body-l">Until post-trade settlement is solved, growth in tokenized equities is limited by market makers’ balance sheets. Capital has to sit on every venue, and then again for every chain and every flavor of the same stock. It scales with venues, not with risk. Cash proceeds cannot pay for the share, so the industry cannot grow past the inventory those balance sheets can carry.</p>
</div>
${stepper({ scene: 'prefund', fig: 'FIG. 2', title: 'Without clearing, market makers pre-fund every venue' })}
</div>
</section>`;

  const clearing = `<section class="sec" id="clearing">
${secL('§2', 'Clearing')}
<div class="col">
<h2 class="h2">Multimodal clearing is the missing infrastructure</h2>
<p class="body-l">A new kind of clearing which we believe is the missing infrastructure to enable liquidity to flow freely across tradfi to defi and across different flavors of tokens and venues worldwide.</p>
${stepper({ scene: 'clearing', fig: 'FIG. 3', title: 'A multimodal clearinghouse' })}
<div style="height:1px;background:var(--line);margin:16px 0 4px"></div>
<h2 class="h2">Netting is the highest-leverage invention in market infrastructure utilities.</h2>
<p class="body-l">Its efficiency improves with scale. Since a clearinghouse is able to net multi-laterally, it is orders of magnitude more capital efficient than multiple bilateral deals.<sup class="ref"> [1]</sup></p>
<div class="ntable">
<div class="row h"><span>Utility</span><span>What it nets</span><span>Result [2]</span></div>
${C.NT.map(r => `<div class="row"><span class="u">${r.u}</span><span>${r.w}</span><span><span class="tag-dark">${r.r}</span>${r.x}</span></div>`).join('')}
</div>
<div class="panel" data-agents>
<div class="panel-h"><span class="eyebrow ink">Settlement agents on one venue</span><label class="range"><span>n = <span data-n>5</span></span><input type="range" min="2" max="10" step="1" value="5" aria-label="Number of settlement agents"></label></div>
<div class="two">
<div><div class="hd"><span class="eyebrow">Bilateral · n(n−1) sub-accounts</span><span class="big" data-bil>20</span></div><div class="sq" data-bilsq></div></div>
<div><div class="hd"><span class="eyebrow">Cleared · one ledger, n accounts</span><span class="big" data-clr>5</span></div><div class="sq y" data-clrsq></div></div>
</div>
</div>
${cap('FIG. 4', 'Accounts needed for every agent to settle with every other. Drag to change n. With a clearinghouse, net dues are published every cycle and anything unsettled rolls over to the next one.')}
<div class="refs"><span>[1] Larry Tabb, Bloomberg Intelligence, “Equity Tokens Need Netting Not Instant Settlement”, May 20, 2026</span><span>[2] Simon Taylor, Tempo Blockchain, “Netting is All You Need”, Aug 7, 2026</span></div>
</div>
</section>`;

  const useCases = `<section class="sec" id="use-cases">
${secL('§3', 'Use cases')}
<div class="col">
<h2 class="h2">Six use cases</h2>
<p class="body-l">Without liquidity, trading venues cannot function. Since we are now seeing great growth of tokenized equities trading, the need to solve the liquidity problem is becoming increasingly urgent.</p>
<div class="acc" data-acc>
${C.UC.map((u, i) => `<div class="acc-i">
<button class="acc-b" type="button" aria-expanded="${i === 0}" aria-controls="uc-p-${u.n}" id="uc-b-${u.n}"><span class="n">${u.n}</span><span class="tt"><span class="t">${u.t}</span><span class="s">${u.s}</span></span><span class="v">${u.video ? '<span>Video</span>' : ''}</span><span class="sg" aria-hidden="true">${i === 0 ? '−' : '+'}</span></button>
<div class="acc-p" id="uc-p-${u.n}" role="region" aria-labelledby="uc-b-${u.n}"${i === 0 ? '' : ' hidden'}><span></span><p class="body">${u.d}</p><div class="r"><div class="chips">${u.p.map(p => `<span class="chip">${p}</span>`).join('')}</div><a class="u" href="/use-cases/${u.slug}/">Read use case ${u.n} →</a></div></div>
</div>`).join('')}
</div>
</div>
</section>`;

  const foundation = `<section class="sec" id="foundation">
${secL('§4', 'The Foundation')}
<div class="col">
<h2 class="h2">A Foundation and a global network of clearinghouses</h2>
<div class="fgrid">
<div class="fcard"><span class="eyebrow">The Foundation</span><span class="tt">Sets the open standard</span><p>Sets and maintains the open source protocol standards agreed upon by token issuers, tokenization agents, venues, clearing members, other protocols and CSDs.</p><ul><li>Legally independent</li><li>Funded by member dues</li><li>Holds the protocol IP under an irrevocable open source license</li></ul></div>
<div class="fcard dark"><span class="eyebrow">Global network of clearinghouses</span><span class="tt">Backstop settlement</span><p>Clearinghouses worldwide backstop settlement of tokenized RWAs onchain and offchain, allowing minting at time T on their backstop.</p><ul><li>Certify that an implementation conforms to the protocol standard</li><li>Admit members, a credit decision based on each rulebook’s financial and operational requirements</li><li>Certification is a precondition of membership and does not by itself grant a backstop</li></ul></div>
</div>
<div class="panel pad24" style="display:flex;flex-direction:column;gap:10px">
<span class="eyebrow">Clearinghouses worldwide</span>
<div class="juris"><span>US</span><span>EU</span><span>UK</span><span>...</span></div>
<div class="tl"><div class="hd"><b>Multimodal clearing <span class="y">OPEN SOURCE TECHNOLOGY</span></b><span class="g">REFERENCE IMPLEMENTATION · ALPACA</span></div><div class="cells">${C.TL.map(c => `<div class="cell"><b>${c.t}</b><span>${c.d}</span></div>`).join('')}</div></div>
<div class="ybar"><b>Post-trade settlement of tokenized equities</b><span>ONCHAIN AND OFFCHAIN</span></div>
</div>
${cap('FIG. 5', 'One technology layer for clearinghouses. Member classes: issuers, clearing members, venues, vaults, oracles, CSDs.')}
</div>
</section>`;

  const roadmap = `<section class="sec" id="roadmap">
${secL('§5', 'Roadmap')}
<div class="col">
<h2 class="h2">Five phases, from a reference implementation to clearinghouses worldwide</h2>
<div class="road">${C.PH.map(p => `<div class="ph"><span class="n">PHASE ${p.n}</span><span class="m"><b>${p.t}</b><span>${p.d}</span>${p.m ? `<span class="ms">◆ MILESTONE · ${p.m}</span>` : ''}</span><span class="g">${p.g}</span><span class="st">${p.now ? '<span class="badge-now">NOW</span>' : '<span class="badge-tbd">TBD</span>'}</span></div>`).join('')}</div>
</div>
</section>`;

  const os = `<section class="sec" id="open-source">
${secL('§6', 'Open source')}
<div class="os">
<div class="l"><h2 class="h2">A protocol participants can build their business on</h2><p class="body">Members contribute this software under the irrevocable license so participants can trust that it is a protocol they can build their business on without fear of it being taken away.</p><a class="btn-mono" ${ext(cfg.githubUrl)}>${esc(cfg.githubUrl.replace(/^https?:\/\//, ''))} ↗</a></div>
<div class="panel"><div class="list-h"><span>TEMPLATE CONTRACTS · EXAMPLES</span><span>STATUS</span></div>${C.TC.map(t => `<div class="list-r"><span>${t}</span><span>planned</span></div>`).join('')}</div>
</div>
</section>`;

  const sigs = `<section class="sec" id="signatories">
${secL('§7', 'Signatories')}
<div class="col g24">
<div class="row-h"><h2 class="h2">Signatories</h2><a class="u" href="/signatories/">All signatories →</a></div>
<div class="sig6">${cfg.publicSignatories.map(g => `<div>${g.logo ? `<img src="${esc(g.logo)}" alt="">` : '<span class="lg">LOGO</span>'}<b>${esc(g.name)}</b></div>`).join('')}</div>
</div>
</section>`;

  const participate = `<section class="sec end" id="participate">
${secL('§8', 'Participate')}
<div class="col">
<h2 class="h2">Participate</h2>
<div class="gi4">${C.INT.map(g => `<div><span class="eyebrow">${g.k}</span><b>${g.t}</b><span class="d">${g.d}</span>${g.id === 'build' ? `<a class="u" ${ext(cfg.githubUrl)}>${g.c} →</a>` : `<a class="u" href="/get-involved/#sign-up">${g.c} →</a>`}</div>`).join('')}</div>
<div class="split">
<a class="boxlink" href="/get-involved/#sign-up"><span class="eyebrow">§8 · Sign up</span><b>Get progress updates, join, fund or contribute</b><span class="d body-s">One form: your work email and organization.</span><span class="go">Sign up →</span></a>
${proposalCard()}
</div>
</div>
</section>`;

  return { body: hero + problem + clearing + useCases + foundation + roadmap + os + sigs + participate };
};
