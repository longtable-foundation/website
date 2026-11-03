const cfg = require('../config');
const C = require('../content');
const { esc, ext } = require('../layout');
const { followForm, proposalCard, cap, hex, share } = require('../components');
const { secL, foundationBlock, roadmapBlock, openSourceBlock } = require('../sections');

// Stageshow-style stills: quiet chrome, few real strings, hard crop. Deck §01 diagrams.
function figExec() {
  return `<div class="split-call">
<div class="sc">
<span class="eyebrow">Pre-funding</span>
<p>Atomic settlement requires participants to pre-position cash and securities before the trade. Pre-funding is balance sheet intensive and is rarely desired.</p>
</div>
<div class="sc on">
<span class="eyebrow ink"><span class="dot" aria-hidden="true"></span>Multimodal clearing</span>
<p>A new kind of clearing that lets liquidity flow freely between traditional markets (tradfi) and onchain finance (defi), and across every form of token and venue worldwide.</p>
</div>
</div>`;
}

function figBenchmark() {
  return `<div class="stats">
<div class="stat"><span class="v">$100T</span><span class="l">in assets custodied at the DTC, the DTCC’s depository subsidiary</span></div>
<div class="stat"><span class="v">$4.6<small>Q</small></span><span class="l">in trades cleared every year by the NSCC, its clearinghouse subsidiary</span></div>
<div class="stat"><span class="v">98%</span><span class="l">of US cash equity settlement obligations netted away. ${esc(C.NT[0].x)}</span></div>
</div>`;
}

function figModalities() {
  return `<div class="panel modal">
<span class="pill-dark">One economic exposure · the same underlying share</span>
<div class="mods">
<div class="mod"><span class="ic">${share('l')}</span><span class="t">Traditional share</span><span class="d">Regulated securities custody</span></div>
<div class="mod"><span class="ne" aria-hidden="true">≠</span><span class="ic">${hex()}</span><span class="t">Issuer-sponsored token</span><span class="d">Issuer-authorized register</span></div>
<div class="mod"><span class="ne" aria-hidden="true">≠</span><span class="ic"><span class="combo">${hex()}${share()}</span></span><span class="t">Custodial token</span><span class="d">Shares at a regulated custodian</span></div>
<div class="mod"><span class="ne" aria-hidden="true">≠</span><span class="ic"><span class="spv">${hex('m')}</span></span><span class="t">Linked security token</span><span class="d">SPV holds the underlying</span></div>
</div>
<div class="legend"><span>${hex('s')}Token</span><span>${share()}Share</span></div>
<div class="dashed-note">No common clearing mechanism · not automatically fungible</div>
</div>`;
}

function figUnbundle() {
  return `<div class="stage-fig unbundle">
<div class="sf-plate">
<div class="ub-grid">
<div class="ub-col">
<span class="ub-k">Traditional equities</span>
<span class="ub-sub">DTCC · one CCP group</span>
<div class="ub-stack">
<div class="ub-box ink">NSCC</div>
<div class="ub-box ink">DTC</div>
</div>
<p class="ub-cap">The clearinghouse requires tight integration to the assets in custody to provide multi-lateral netting and delayed settlement.</p>
</div>
<div class="ub-col">
<span class="ub-k">Tokenized equities</span>
<span class="ub-sub">Unbundled</span>
<div class="ub-stack">
<div class="ub-box dash">No NSCC equivalent</div>
<div class="ub-box tok">Onchain<span class="ub-icons">${hex('s')}${hex('s')}${hex('s')}${hex('s')}</span></div>
</div>
<p class="ub-cap">Custody and settlement now exist outside of the CCP’s custody, with cryptographically provable ownership.</p>
</div>
</div>
<p class="ub-take">In DTCC terms, the industry has unbundled the custody part (DTC) of the DTCC, but there is no clearinghouse (NSCC) solution yet.</p>
</div>
</div>`;
}

function figPark() {
  return `<div class="stage-fig park">
<div class="sf-chrome"><span class="sf-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="sf-title">capital · pre-funded venues</span><span class="sf-meta">illustrative</span></div>
<div class="sf-plate">
<span class="sf-lab">Venues · capital parked on each one</span>
<div class="sf-row venues">
${['ATS', 'Onchain RFQ', 'DEX', 'Bridge'].map(v => `<div class="sf-card"><span>${v}</span><span class="sf-coins"><i class="c">$</i><i class="t"></i><i class="t"></i></span></div>`).join('')}
</div>
<div class="sf-flow up" aria-hidden="true"><span></span><span></span><span></span></div>
<span class="sf-lab mute">Pulled out to pre-fund</span>
<span class="sf-lab">Where capital is productive</span>
<div class="sf-row prod">
<div class="sf-card dash"><b>USD</b><span>in bank accounts</span></div>
<div class="sf-card dash"><b>Securities</b><span>at DTC &amp; CSDs</span></div>
<div class="sf-card dash"><b>Tokenized securities</b><span>in Aave &amp; Morpho vaults</span></div>
</div>
<p class="sf-callout neg"><span aria-hidden="true">−</span>Positions don’t net across venues. Capital scales with the number of venues, not with the risk.</p>
</div>
</div>`;
}

function figClear() {
  return `<div class="stage-fig clear">
<div class="sf-chrome"><span class="sf-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="sf-title">capital · cleared venues</span><span class="sf-meta">illustrative</span></div>
<div class="sf-plate">
<span class="sf-lab">Settle post-trade · nothing parked</span>
<div class="sf-row venues">
${['ATS', 'Onchain RFQ', 'DEX', 'Bridge'].map(v => `<div class="sf-card empty"><span>${v}</span><span class="sf-coins"><i class="dash"></i><i class="dash"></i></span></div>`).join('')}
</div>
<div class="sf-flow down" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
<div class="sf-ch">
<span class="sf-ch-n">Clearinghouse</span>
<span class="sf-pills"><span>Multilateral netting</span><span>Backstop</span><span>Post-trade settlement</span></span>
</div>
<div class="sf-flow up soft" aria-hidden="true"><span></span><span></span><span></span></div>
<span class="sf-lab">Credited in place · sized to net risk</span>
<div class="sf-row prod">
<div class="sf-card"><b>USD</b><span>in bank accounts</span></div>
<div class="sf-card"><b>Securities</b><span>at DTC &amp; CSDs</span></div>
<div class="sf-card"><b>Tokenized securities</b><span>in Aave &amp; Morpho vaults</span></div>
</div>
<p class="sf-callout pos"><span aria-hidden="true">+</span>Collateral stays where it is productive. Nothing sits idle on the venues.</p>
</div>
</div>`;
}

function figItn() {
  return `<div class="stage-fig itn">
<div class="sf-chrome"><span class="sf-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="sf-title">itn · closed system</span><span class="sf-meta">ITN MVP</span></div>
<div class="sf-plate">
<div class="itn-loop">
<div class="itn-row">
<span class="itn-node">Issuer</span>
<span class="itn-arr" aria-hidden="true">↔</span>
<span class="itn-node ink">ITN</span>
<span class="itn-arr" aria-hidden="true">↔</span>
<span class="itn-node">Minting participant</span>
</div>
<div class="itn-bar">Traditional asset custodied with the ITN operator</div>
</div>
<div class="itn-out">
<span class="sf-lab mute">Outside the loop</span>
<div class="itn-xrow">
<div class="sf-card dash x"><span class="xmark" aria-hidden="true">✕</span><span>Inventory custodied elsewhere</span></div>
<div class="sf-card dash x"><span class="xmark" aria-hidden="true">✕</span><span>Issuer not on ITN</span></div>
</div>
</div>
</div>
</div>`;
}

module.exports = function home() {
  const ITN_DOCS = 'https://docs.alpaca.markets/us/docs/tokenization-guide-for-authorized-participant';

  // The hero leads with the mechanism, not a talk: one share, four forms, no common clearing.
  const hero = `<section class="hero">
<div class="l">
<h1 class="h1">Multimodal clearing is the missing infrastructure.</h1>
<div class="abstract"><span class="eyebrow">Abstract</span><p>Longtable is a foundation that stewards open source infrastructure to support multimodal clearing of tokenized assets by licensed clearinghouses worldwide.</p></div>
${followForm({ id: 'follow-hero', title: 'Follow the work as it lands' })}
<a class="u alt" href="${esc(cfg.proposal.href)}" data-proposal>Or read the ${cfg.proposal.pages}-page proposal, by email →</a>
</div>
<figure>
${figModalities()}
<figcaption><span><span class="figno">FIG. 0</span>The same share now exists in several forms, trading on different venues and chains. Multimodal clearing lets licensed clearinghouses net and settle all of them, post-trade.</span></figcaption>
</figure>
</section>`;

  const exec = `<section class="sec first" id="executive-summary">
${secL('§1', 'Executive summary')}
<div class="col">
<h2 class="h2">Atomic settlement reduces systemic risk for capital markets globally. <span class="soft">However, when it comes to trading, atomic settlement is not always desired.</span></h2>
${figExec()}
<h2 class="h2">In US equities, netting removes 98% of settlement obligations</h2>
${figBenchmark()}
<p class="body-l">This is achieved by venues and members subscribing to delayed settlement, netting, margin and risk management rules set by the clearinghouse (the NSCC) that essentially provides “slack” in the system to allow for liquidity to flow efficiently between clearing members and between venues.</p>
<p class="markline">Today, tokenized equities settlement is scattered across venues, chains, and token standards with <mark>no NSCC equivalent.</mark></p>
</div>
</section>`;

  const multimodal = `<section class="sec" id="multimodal-equities">
${secL('§2', 'Multimodal equities')}
<div class="col">
<h2 class="h2">Multimodal equities require multimodal post-trade infra</h2>
<p class="body-l">Tokenized security markets operate across several representations of the same economic exposure (FIG. 0). These representations can trade on different venues and blockchain networks, but they do not share a common clearing mechanism. Bilateral agreements do not create general settlement interoperability.</p>
<h2 class="h2">Custody has been unbundled. Clearing has not.</h2>
${figUnbundle()}
${cap('FIG. 1', 'In DTCC terms: custody unbundled; clearing not yet rebuilt.')}
</div>
</section>`;

  const prefund = `<section class="sec" id="pre-funding">
${secL('§3', 'Pre-funding')}
<div class="col">
<div class="stat-band">
<div class="stat-band-copy">
<h2 class="h2">Pre-funding was the solution, now it’s the problem</h2>
<p class="body-l">Without centralized clearing, one can only settle against the other with capital-inefficient bilateral agreements. The market has solved this by requiring market makers to deploy capital to pre-fund liquidity on each venue.</p>
<p class="statement">These isolated onchain venues require a centralized clearing layer that provides post-trade settlement and multi-lateral netting in order for tradfi flows to actually move to blockchain rails.</p>
</div>
<aside class="stat-band-aside" aria-label="Market scale">
<span class="eyebrow">Global equities market</span>
<span class="v">$300T</span>
<p>Trillions in tokenized equities will not move onchain until post-trade settlement infrastructure exists.</p>
</aside>
</div>
<h2 class="h2">Pre-funding parks capital on every venue</h2>
<p class="body-l">Each venue settles atomically, so each one needs its own tokens and stablecoins before the first trade. Market makers pull cash, securities and tokens out of the accounts where they are productive and park them on every venue.</p>
${figPark()}
${cap('FIG. 2', 'Capital scales with the number of venues, not with the risk.')}
<h2 class="h2">A clearinghouse sends collateral back to work</h2>
<p class="body-l">Venues settle post-trade against a clearinghouse that nets obligations across every venue and mitigates settlement failures. The inventory parked on each venue moves back to the accounts where it is productive, sized to net risk.</p>
${figClear()}
${cap('FIG. 3', 'Collateral stays where it is productive. Nothing sits idle on the venues.')}
</div>
</section>`;

  const implications = `<section class="sec" id="implications">
${secL('§4', 'Implications')}
<div class="col">
<h2 class="h2">Tokenized assets are not bearer assets like crypto tokens. They are a new modality for the same underlying asset.</h2>
<div class="tri">
<div><span class="eyebrow">Not bearer assets</span><p class="body">Under most regulatory regimes, bearer securities are prohibited for AML reasons and this remains true for tokenized equities, which makes them fundamentally different to crypto tokens.</p></div>
<div><span class="eyebrow">One security, many forms</span><p class="body">The same security can be offered in multiple venues in different forms, creating new liquidity unification challenges across not just venues but also different token formats and blockchains. This is exactly what a clearinghouse solves.</p></div>
<div><span class="eyebrow">Market microstructure</span><p class="body">Multimodality is the core change to market structure. It drives how order books or RFQs receive liquidity, how funds flow between counterparties and when, how financing works, and what licenses, regulation and infrastructure are required.</p></div>
</div>
<blockquote class="punch">There is no market utility today that can provide 24/7 continuous netting or a backstop for settlement across all modalities.</blockquote>
<p class="body-l">Building multi-lateral token clearing in-house would take tradfi CCPs (central counterparty clearinghouses) years, and each would only support their own local form of tokenized entitlements, leaving issuer-sponsored and linked-security tokens with no clearinghouse solution whatsoever.</p>
<h2 class="h2">Implications on clearing</h2>
<div class="cards2">
<div class="icard"><span class="n">1</span><b>In-kind convertibility</b><p class="body">Unifying liquidity and prices requires instant and frictionless in-kind creation and redemption between tradfi and defi versions of assets. ITN (§5) does this in a limited way today; it must scale beyond a single broker-dealer to others and to multiple onchain and offchain venues.</p></div>
<div class="icard"><span class="n">2</span><b>Post-trade settlement</b><p class="body">Delayed settlement is a feature, not a bug, and it creates the need for clearing. Self-clearing DEXs are a genuine innovation, but they are not a solution for multi-lateral netting between venues, or for clearing a traditional share against its tokenized version when the tradfi leg settles T+1.</p></div>
</div>
</div>
</section>`;

  const whyNow = `<section class="sec" id="why-now">
${secL('§5', 'Why now')}
<div class="col">
<h2 class="h2">Why now?</h2>
<div class="tri">
<div><span class="eyebrow">01</span><b class="th">It is now Day 2 for tokenized stocks</b><p class="body">Custody was the necessary first step. For bearer crypto tokens this is where the story ends, but tokenized equities are different. We are entering an era of onchain credit, and for tokenized equities that means post-trade settlement, which requires clearing.</p></div>
<div><span class="eyebrow">02</span><b class="th">The need for clearing has not been well understood</b><p class="body">Atomic settlement works when both legs are pre-funded. There is no concept of post-trade settlement on any tokenized equities trading venue today, so there was no need for a multimodal clearinghouse until tradfi institutional adoption entered the zeitgeist.</p></div>
<div><span class="eyebrow">03</span><b class="th">Every new clearinghouse needs to beat the chicken &amp; egg problem</b><p class="body">Most fail due to not achieving critical mass. ITN, below, is the only example that has beaten the chicken &amp; egg problem.</p></div>
</div>
<h2 class="h2">Proof point: ITN</h2>
<p class="body-l">Longtable’s incubator, Alpaca, built the <a class="u" ${ext(ITN_DOCS)}>Instant Tokenization Network (ITN)</a> as an MVP for how post-trade settlement and clearing can work for tokenized equities. Participants can mint unsettled share positions at time T because the operator underwrites itself for potential T+1 failures, but only in a closed system where both the issuer and the minting participant custody the traditional asset with it. This is how the NSCC started: as a single-venue clearinghouse inside the NYSE.</p>
${figItn()}
${cap('FIG. 4', 'ITN works today inside a closed loop. Inventory custodied elsewhere, and issuers outside the loop, remain outside.')}
<h2 class="h2">Liquidity challenges remaining</h2>
<p class="body-l">While in-kind minting and redeeming works inside ITN’s closed system, the following challenges remain:</p>
<div class="cards2">
<div class="icard"><span class="eyebrow">Problem 1</span><b>The open-loop problem</b><p class="body">Mint where tradfi inventory is custodied elsewhere, or the issuer is not on ITN.</p></div>
<div class="icard"><span class="eyebrow">Problem 2</span><b>The pre-funding problem</b><p class="body"><b>RFQ variant.</b> Atomically mint primary issued tokens in response to RFQ taker orders and use the proceeds to settle with the issuer post-trade.<br><br><b>DRS variant.</b> Issuer-sponsored tokens are bottlenecked by DRS (the Direct Registration System, which moves title from DTC to the transfer agent) and settle T+N, solvable only with a time T backstop.</p></div>
</div>
</div>
</section>`;

  const useCases = `<section class="sec" id="use-cases">
${secL('§6', 'Use cases')}
<div class="col">
<div class="row-h"><h2 class="h2">Six use cases</h2><a class="u" href="/use-cases/01/">All use cases →</a></div>
<p class="body-l">Without liquidity, trading venues cannot function. As tokenized equities trading grows, the need to solve the liquidity problem is becoming urgent.</p>
<div class="uc-grid">
${C.UC.map(u => `<a class="uc-tile" href="/use-cases/${u.slug}/"><span class="n">${u.n}</span><span class="tt"><b>${u.t}</b><span>${u.s}</span></span><span class="go">→</span></a>`).join('')}
</div>
</div>
</section>`;

  const foundation = foundationBlock({ no: '§7' });
  const roadmap = roadmapBlock({ no: '§8' });
  const os = openSourceBlock({ no: '§9', compact: true });

  // One closing moment: follow, with the proposal and GitHub as the only alternatives.
  const sigLine = cfg.signatoriesConfirmed
    ? `<div class="sig6">${cfg.publicSignatories.map(g => `<div>${g.logo ? `<img src="${esc(g.logo)}" alt="">` : ''}<b>${esc(g.name)}</b></div>`).join('')}</div>`
    : `<p class="sigline">Founding signatories will be announced here. Membership is open to issuers, clearing members, venues, vaults, oracles and CSDs. <a class="u" href="/get-involved/#sign-up">Apply to join →</a></p>`;
  const talk = cfg.videos.summitTalk
    ? `<a class="u" ${ext('https://www.youtube.com/watch?v=' + cfg.videos.summitTalk)}>Watch the 7-minute introduction ↗</a>`
    : '';

  const follow = `<section class="sec end" id="follow">
${secL('§10', 'Follow')}
<div class="col">
<h2 class="h2">Follow Longtable as the standard takes shape</h2>
<div class="close">
${followForm({ id: 'follow-end', title: 'Get Longtable updates by email' })}
${proposalCard()}
</div>
<div class="close-alt"><a class="u" ${ext(cfg.githubUrl)}>Contribute on GitHub ↗</a>${talk}</div>
${sigLine}
</div>
</section>`;

  return { body: hero + exec + multimodal + prefund + implications + whyNow + useCases + foundation + roadmap + os + follow };
};
