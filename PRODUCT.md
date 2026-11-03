# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences carry equal weight, and the site must speak to both without favouring either:

- **Tradfi post-trade institutions:** clearing members, CSDs, transfer agents, banks and clearinghouses. Senior operations and post-trade people judging whether multimodal clearing is credible, compliant and worth backing.
- **Onchain builders:** RFQ intent protocols and solvers, bridge protocols, vaults, oracles, token issuers and tokenization agents. They judge whether the open-source contracts and adapters are worth integrating.

Other confirmed readers: market makers and trading venues (named in the use cases), and press (Press page, press kit, `press@alpaca.markets`).

## Product Purpose

The Longtable Foundation is a foundation and a global network of clearinghouses that use open-source technology for post-trade settlement of tokenized equities, onchain and offchain. The Foundation sets and maintains the open protocol standards agreed by token issuers, tokenization agents, venues, clearing members, other protocols and CSDs.

The site exists to explain why multimodal clearing is the missing infrastructure. Pre-funding was the solution and is now the problem; a clearinghouse backstop lets venues settle post-trade. The site should also bring people into the initiative.

**Primary success:** the visitor follows progress by subscribing to milestones, publications and open calls for comment. Secondary actions are requesting the proposal, applying to join, funding, and contributing code on GitHub.

## Positioning

Longtable is an industry-neutral standards foundation, not a vendor product. Its mechanism is multimodal clearing: a clearinghouse backstop lets tokenized RWAs mint at time T and settle post-trade, with multilateral netting across tradfi and onchain venues. This works because tokenized equities are not bearer assets; they are a new modality of the same underlying share.

Alpaca incubates Longtable, and the site says so (for example "Incubated by Alpaca" on the Foundation page). But Alpaca is not the protagonist. Alpaca's ITN appears as the MVP proof point, not as the brand.

## Operating Context

- Static site published on GitHub Pages and built from `src/pages/*` by `build.js`. While it is a draft, it sits behind a StatiCrypt password.
- Content comes from the external proposal deck ("Multimodal Clearing: a technology layer for licensed clearinghouses", 45 pp, Oct 2026). Use cases cite proposal page numbers.
- Forms collect only work email and organization. They post to a Google Sheet through Apps Script. The proposal PDF is emailed from Google Drive and is never in the repo or on the site.
- Interactive explainers use three.js step-throughs (`public/anim/`), sliders, accordions and video chapters.

## Capabilities and Constraints

- Pages: Home, Foundation, Roadmap, Signatories, Press, Get involved, Proposal, six use-case pages and a 404.
- Six use cases: Saturday-morning mint, many-to-many settlement, pre-funded venues becoming post-trade settled, demoting DRS, post-trade settlement for atomic onchain RFQ, and cross-chain bridging.
- Five-phase roadmap: (1) MVP of the atomic RFQ contract, which is live now; (2) cross-chain clearing; (3) onchain clearinghouse with margincoins; (4) a US clearinghouse partner; (5) full novation through licensed CCPs outside the US.
- Ways to participate: Follow, Join, Fund, Build.
- Terminology to keep: multimodal clearing, pre-funding, post-trade settlement, backstop, mint at time T, multilateral netting, margincoins, clearing member, tokenization agent, DRS.
- Copy lives in `src/content.js` and settings in `src/config.js`.

## Brand Commitments

- Name: Longtable Foundation. Logos are `public/assets/longtable-logo.svg` and `longtable-logo-white.svg`. The media pack is in `../Longtable Media Pack - new logos/`.
- Voice: a neutral, precise standards body, not vendor marketing. Claims are concrete and sourced.
- Boilerplate (`BOILER` in `src/content.js`) is the canonical description.

## Evidence on Hand

- Netting benchmarks: NSCC (98% reduction; $519T settled as $9T), CHIPS (26:1), CLS (>96% funding reduction).
- Video: The Rollup interview at DAS Asia 2026, and the SIFMA Ops 2026 panel with timestamped clips and chapters.
- Press kit ZIP and Open Graph image in `public/assets/`.
- **Absent; do not fabricate:**
  - Signatories are unconfirmed (`signatoriesConfirmed: false`), so the site shows "To be announced" slots. The placeholder names must not appear as real.
  - The Alpaca Summit talk and use-case videos 01–03 have no IDs yet.
  - The TABB and Taylor article links are empty.
  - There are no testimonials, member counts or deployment claims beyond what is stated above.

## Product Principles

1. **Neutral by default.** Write and design as an industry standard that both tradfi and onchain participants can own. Alpaca is disclosed, never centred.
2. **Bridge both worlds.** Every explanation should make sense to a post-trade ops lead and to a protocol engineer. Neither side's jargon goes unexplained.
3. **Show the mechanism.** Earn credibility by explaining how settlement, netting and the backstop work, using real benchmarks and sources, not adjectives.
4. **Keep the relationship going.** Following progress is the main conversion. Content should reward coming back as milestones land.
5. **Facts stay true.** Unconfirmed partners, videos and claims stay as placeholders until they are confirmed.
