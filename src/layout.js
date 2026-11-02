const cfg = require('./config');

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ext = href => `href="${esc(href)}" target="_blank" rel="noopener"`;

const mark = () => '<span class="mark" aria-hidden="true"><span class="top"></span><span class="legs"><i></i><i></i></span></span>';

const NAV = [
  ['use-cases', 'Use cases', '/use-cases/01/'],
  ['foundation', 'Foundation', '/#foundation'],
  ['roadmap', 'Roadmap', '/#roadmap'],
  ['signatories', 'Signatories', '/signatories/'],
  ['about', 'About', '/about/'],
  ['press', 'Press', '/press/'],
];

function header({ doc, docShort, active }) {
  const cur = k => (k === active ? ' aria-current="page"' : '');
  const links = NAV.map(([k, t, h]) => `<a href="${h}"${cur(k)}>${t}</a>`).join('');
  const bar = cfg.docBar ? `<div class="docbar">
<span><span class="long">${esc(doc)}</span><span class="short">${esc(docShort || 'LT-0001 · Draft')}</span></span>
<span class="r"><span class="clock">UTC <span data-utc>--:--:--</span></span><span>Cycle <span data-cyc>1</span>/3 · T+H8</span><span class="bar" aria-hidden="true"><i data-cycbar></i></span><span class="dim">Illustrative</span></span>
</div>` : '';
  return `<a class="skip" href="#main">Skip to content</a>
${bar}
<header class="hdr">
<a class="brand" href="/" aria-label="Longtable Foundation home">${mark()}<span class="name">Longtable</span><span class="sub">Foundation</span></a>
<nav class="nav" aria-label="Main">${links}</nav>
<div class="hdr-r"><a class="gh" ${ext(cfg.githubUrl)}>GitHub ↗</a><a class="cta" href="/get-involved/"${cur('get-involved')}>Get involved</a></div>
<button class="menu-btn" type="button" aria-expanded="false" aria-controls="mnav">MENU<span class="bars" aria-hidden="true"><i></i><i></i></span></button>
<nav class="mnav" id="mnav" aria-label="Main" hidden>${links}<a ${ext(cfg.githubUrl)}>GitHub <span>↗</span></a><a class="btn" href="/get-involved/">Get involved</a></nav>
</header>`;
}

function footer({ compact } = {}) {
  if (compact) {
    return `<footer class="ftr-c"><span class="w">LONGTABLE FOUNDATION</span><span>INCUBATED BY ALPACA</span><a href="/press/">PRESS · ${esc(cfg.pressEmail.toUpperCase())}</a><span>© 2026</span></footer>`;
  }
  return `<footer class="ftr">
<div class="cols">
<div class="c c0"><span class="brand">${mark()}<span class="name">Longtable</span></span><p>An open source foundation for multimodal clearing. Incubated by Alpaca.</p></div>
<div class="c"><span class="h">FOUNDATION</span><a href="/#foundation">Structure</a><a href="/#roadmap">Roadmap</a><a href="/signatories/">Signatories</a><a href="/about/">About</a></div>
<div class="c"><span class="h">RESOURCES</span><a href="/use-cases/01/">Use cases</a><a href="${esc(cfg.proposal.href)}" download>Proposal (PDF)</a><a href="/press/#talks">Talks &amp; interviews</a><a ${ext(cfg.githubUrl)}>GitHub ↗</a></div>
<div class="c"><span class="h">PRESS</span><span class="t">Media inquiries are handled by the Alpaca media team.</span><a class="w" href="mailto:${esc(cfg.pressEmail)}">${esc(cfg.pressEmail)}</a><a href="/press/">Press page →</a></div>
</div>
<div class="bot"><span>© 2026 LONGTABLE FOUNDATION</span><span>LT-0001 · DRAFT FOR COMMENT</span></div>
</footer>`;
}

function page({ title, description, path, doc, docShort, active, body, compactFooter }) {
  const full = title ? `${title} · Longtable Foundation` : 'Longtable Foundation · An open standard for clearing tokenized equities';
  const desc = description || 'Longtable is a foundation and a global network of clearinghouses that use open source technology for post-trade settlement of tokenized equities, onchain and offchain.';
  const canon = cfg.siteUrl ? `<link rel="canonical" href="${esc(cfg.siteUrl.replace(/\/$/, '') + path)}">\n<meta property="og:url" content="${esc(cfg.siteUrl.replace(/\/$/, '') + path)}">` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:image" content="${cfg.siteUrl ? esc(cfg.siteUrl.replace(/\/$/, '')) : ''}/assets/og.png">
<meta name="twitter:card" content="summary_large_image">
${canon}
<meta name="theme-color" content="#111111">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css?v=${BUILD_ID}">
</head>
<body data-base="${esc(cfg.basePath)}" data-form-endpoint="${esc(cfg.formEndpoint)}" data-gform="${esc(cfg.googleForm.action ? JSON.stringify(cfg.googleForm) : '')}">
${header({ doc, docShort, active })}
<main id="main">
${body}
</main>
${footer({ compact: compactFooter })}
<script src="/app.js?v=${BUILD_ID}" defer></script>
</body>
</html>
`;
}

const BUILD_ID = Date.now().toString(36);

module.exports = { page, esc, ext, mark };
