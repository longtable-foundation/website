---
target: homepage
total_score: 18
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:/Users/arush.sehgal/Documents/workspace/strategy/longtable/website/src/pages/home.js"
target_fingerprint: "sha256:2da1ffe76074554855721ee9fd440da8df1277b08dd815f060eecf5c14594e6f"
target_path: /Users/arush.sehgal/Documents/workspace/strategy/longtable/website/src/pages/home.js
timestamp: 2026-11-03T16-49-39Z
slug: src-pages-home-js
closed: true
---
# Critique: Longtable homepage (src/pages/home.js)
Method: dual-agent (A: design review, B: detector). No browser access (Claude in Chrome not connected); source + dist/index.html only.

## Design Health Score
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 2 | § numbers but no TOC/active section; no-cors form can show false success |
| 2 | Match with real world | 3 | NSCC/DRS/novation unexplained for builders; solver/defi unexplained for tradfi |
| 3 | User control & freedom | 3 | Dialog closes via ✕/Esc/backdrop; back-to-form |
| 4 | Consistency & standards | 2 | Six CTA labels to one URL; H2 at home.js:180 repeats H1 |
| 5 | Error prevention | 2 | Apps Script no-cors POST always resolves (app.js:10-12) |
| 6 | Recognition over recall | 2 | § index implied but absent |
| 7 | Flexibility/efficiency | n/a | Persuade surface |
| 8 | Aesthetic & minimalist | 2 | 18 equal H2s; pre-funding argued in §1, §4, §5 |
| 9 | Error recovery | 2 | No aria-live; raw "Failed to fetch" |
| 10 | Help & docs | n/a | Persuade surface |
| Total | | 18/32 (56%) | Acceptable |

## Design Specificity Verdict
Half-specific: document metaphor and §3-§4 mechanism figures are authored; hero split, stat row, dark big-number aside, 4-up CTA grid and logo wall are category-interchangeable.
Detector: 18 findings (15 warning, 3 advisory) in dist/index.html. Real: .sf-meta 2.2:1 (styles.css:818), .vid .lbl 4.1:1, 11px mono labels (styles.css:138,145,814). Placeholder-driven: 6x 10px "LOGO" at 2.2:1 (styles.css:292), stripe gradient on .vid. Likely false positives: cramped-padding on .sf-chrome, tight-leading 1.25 on short headings. Detector missed: --focus yellow ~1.5:1 (styles.css:25,46,320).

## Priority Issues
1. [P1] Primary conversion (Follow) is the secondary outlined button; no inline subscribe form on homepage (home.js:147). Fix: inline email+org Follow form in hero and close; proposal secondary. Cmd: layout, clarify.
2. [P1] Hero is an empty Alpaca-branded video placeholder; 22 Alpaca mentions make Alpaca the protagonist. Fix: mechanism figure in hero; ITN as one Proof point figure. Cmd: layout.
3. [P1] Focus ring = token yellow ~1.5:1, fails WCAG 1.4.11. Fix: ink outline + accent halo; ink border on focused fields. Cmd: audit.
4. [P2] Accent yellow means token AND interactive/positive/highlight; --cash/--positive unused; "+" callout yellow (styles.css:849). Fix: reserve token/cash/share for diagrams; ink inversion/underline for interaction; green for positive. Cmd: colorize.
5. [P2] Conclusion is §5 of 11; page ends on 8 "planned" contracts, 6 LOGO tiles, 6 CTAs. Fix: one-line signatories, trim §9, merge §10+§11 into ≤3-option Follow close. Cmd: distill.

## Persona Red Flags
- Jordan: H1 assumes "multimodal clearing" known; no personal problem stated early.
- Riley: false success on failed submit; "Failed to fetch"; error overwrites consent note; placeholder pile-up.
- Casey: hero CTAs below dead video box; .mod .ne hidden at 720px loses "≠"; park/clear figures lose spatial story; 7-item header.
- Tradfi ops lead: unsourced $100T/$4.6Q/$300T; "2%/98%" looser than sourced $519T→$9T; vendor-tone phrases; thin governance.
- Onchain engineer: Phase 1 "live" but no contract address/repo/spec; §9 all planned; atomic RFQ two clicks away.

## Minor Observations
- home.js:280 eyebrow repeats § number; §7/§8 vs §4/§5 numbering drift (sections.js:9,30); faint .u underline; competing mark highlights; redundant aria-hidden="false" (home.js:44); forced newsletter opt-in on proposal form.

## Questions to Consider
- Would §3, §4 and a Follow form alone persuade better?
- Should yellow mean "token" or "click me"?
- What's the onchain equivalent of the NSCC 98% stat — a live Phase 1 contract address?
