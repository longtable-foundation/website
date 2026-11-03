// Shared section markup used on the home page and on dedicated Foundation / Roadmap pages.
const cfg = require('./config');
const C = require('./content');
const { esc, ext } = require('./layout');
const { cap } = require('./components');

const secL = (no, nm) => `<div class="sec-l"><span class="no">${no}</span><span class="nm">${nm}</span></div>`;

function foundationBlock({ id = 'foundation', first = false, heading = true, no = '§4', label = 'The Foundation' } = {}) {
  // Always emit sec-l so the two-column .sec grid keeps .col in the content track
  // (dedicated pages pass heading:false after their own page title section).
  return `<section class="sec${first ? ' first' : ''}" id="${id}">
${heading ? secL(no, label) : '<div class="sec-l" aria-hidden="true"></div>'}
<div class="col">
${heading ? '<h2 class="h2">A Foundation and a global network of clearinghouses</h2>\n' : ''}<div class="fgrid">
<div class="fcard"><span class="eyebrow">The Foundation</span><span class="tt">Sets the open standard</span><p>Sets and maintains the open source protocol standards agreed upon by token issuers, tokenization agents, venues, clearing members, other protocols and CSDs.</p><ul><li>Legally independent</li><li>Funded by member dues</li><li>Holds the protocol IP under an irrevocable open source license</li></ul></div>
<div class="fcard dark"><span class="eyebrow">Global network of clearinghouses</span><span class="tt">Settlement Finality</span><p>Clearinghouses worldwide mitigate settlement failures of tokenized RWAs onchain and offchain, allowing minting at time T on their backstop.</p><ul><li>Certify that an implementation conforms to the protocol standard</li><li>Admit members, a credit decision based on each rulebook’s financial and operational requirements</li><li>Certification is a precondition of membership and does not by itself grant a backstop</li></ul></div>
</div>
<div class="panel pad24" style="display:flex;flex-direction:column;gap:10px">
<span class="eyebrow">Clearinghouses worldwide</span>
<div class="juris"><span>US</span><span>EU</span><span>UK</span><span>...</span></div>
<div class="tl"><div class="hd"><b>Multimodal clearing <span class="y">OPEN SOURCE TECHNOLOGY</span></b><span class="g">REFERENCE IMPLEMENTATION · ALPACA</span></div><div class="cells">${C.TL.map(c => `<div class="cell"><b>${c.t}</b><span>${c.d}</span></div>`).join('')}</div></div>
<div class="ybar"><b>Post-trade settlement of tokenized equities</b><span>ONCHAIN AND OFFCHAIN</span></div>
</div>
${cap('FIG. 6', 'One technology layer for clearinghouses. Member classes: issuers, clearing members, venues, vaults, oracles, CSDs.')}
</div>
</section>`;
}

function roadmapBlock({ id = 'roadmap', first = false, heading = true, no = '§5', label = 'Roadmap' } = {}) {
  return `<section class="sec${first ? ' first' : ''}" id="${id}">
${heading ? secL(no, label) : '<div class="sec-l" aria-hidden="true"></div>'}
<div class="col">
${heading ? '<h2 class="h2">Five phases, from a reference implementation to clearinghouses worldwide</h2>\n' : ''}<div class="road">${C.PH.map(p => `<div class="ph"><span class="n">PHASE ${p.n}</span><span class="m"><b>${p.t}</b><span>${p.d}</span>${p.m ? `<span class="ms">◆ MILESTONE · ${p.m}</span>` : ''}</span><span class="g">${p.g}</span><span class="st">${p.now ? '<span class="badge-now">NOW</span>' : '<span class="badge-tbd">TBD</span>'}</span></div>`).join('')}</div>
</div>
</section>`;
}

function openSourceBlock({ id = 'open-source', no = '§6' } = {}) {
  return `<section class="sec" id="${id}">
${secL(no, 'Open source')}
<div class="os">
<div class="l"><h2 class="h2">A protocol participants can build their business on</h2><p class="body">Members contribute this software under the irrevocable license so participants can trust that it is a protocol they can build their business on without fear of it being taken away.</p><a class="btn-mono" ${ext(cfg.githubUrl)}>${esc(cfg.githubUrl.replace(/^https?:\/\//, ''))} ↗</a></div>
<div class="panel"><div class="list-h"><span>TEMPLATE CONTRACTS · EXAMPLES</span><span>STATUS</span></div>${C.TC.map(t => `<div class="list-r"><span>${t}</span><span>planned</span></div>`).join('')}</div>
</div>
</section>`;
}

module.exports = { secL, foundationBlock, roadmapBlock, openSourceBlock };
