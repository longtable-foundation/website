const cfg = require('./config');
const { esc, ext } = require('./layout');

// Video thumbnail. With a YouTube id it links out; without one it shows a "coming soon" placeholder.
function video({ id, label, dur, durLeft, small, start }) {
  const cls = 'vid' + (small ? ' sm' : '');
  const durHtml = dur ? `<span class="dur${durLeft ? ' l' : ''}"${durLeft ? ' data-chap-badge' : ''}>${esc(dur)}</span>` : '';
  if (id) {
    const href = `https://www.youtube.com/watch?v=${encodeURIComponent(id)}${start ? `&t=${start}s` : ''}`;
    return `<a class="${cls} has-img" ${ext(href)} data-yt="${esc(id)}" aria-label="${esc(label)} (opens YouTube)"><img src="https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg" alt="" loading="lazy"><span class="play" aria-hidden="true"></span>${durHtml}</a>`;
  }
  return `<div class="${cls} soon" role="img" aria-label="${esc(label)}: video coming soon"><span class="lbl">${esc(label)} · Video coming soon</span><span class="play" aria-hidden="true"></span>${durHtml}</div>`;
}

const link = (href, inner, cls = 'u') => (href ? `<a class="${cls}" ${ext(href)}>${inner}</a>` : `<span class="${cls}" style="opacity:.5" title="Link coming soon">${inner}</span>`);

const proposalBtn = (label = 'Download the proposal') =>
  `<a class="btn" href="${esc(cfg.proposal.href)}" download>${label} <span class="meta">PDF · ${cfg.proposal.pages} pp</span></a>`;

const proposalCard = () => `<a class="pdfcard" href="${esc(cfg.proposal.href)}" download>
<span class="eyebrow">LT-0001 · External proposal</span>
<b>${esc(cfg.proposal.title)}</b>
<span class="ft"><span>PDF · ${cfg.proposal.pages} pages · ${esc(cfg.proposal.date)}</span><span>Download ↓</span></span>
</a>`;

const cap = (no, text) => `<p class="cap"><span class="figno">${esc(no)}</span>${text}</p>`;

const LEG = { prefund: ['token', 'cash'], rfq: ['token', 'cash', 'share', 'owed', 'msg'], clearing: ['token', 'cash'], bridge: ['token', 'share', 'owed', 'msg'] };
const NAMES = { token: 'Token', cash: 'Stablecoin', share: 'Share', owed: 'Owed share', msg: 'Message' };

// 3D step-through explainer. app.js wires it up.
function stepper({ scene, fig, title, skip = 0 }) {
  const leg = LEG[scene].map(k => `<span><span class="sym"><span class="sym-${k}"></span></span>${NAMES[k]}</span>`).join('');
  return `<div class="stp${cfg.animColor === 'greyscale' ? ' grey' : ''}" data-stepper="${scene}" data-skip="${skip}" tabindex="0" role="group" aria-label="${esc(fig)}: ${esc(title)}. Use the left and right arrow keys to step through.">
<div class="ttl-c">${esc(title)}</div>
<div class="top"><span class="l"><span class="fig">${esc(fig)}</span><span class="ttl">${esc(title)}</span></span><span class="r"><span class="cnt">STEP <span data-no>--</span> / <span data-total>--</span></span><button class="fsb" type="button" aria-label="Full screen" data-fs>⤢</button></span></div>
<div class="stage" data-stage>
<div class="canvas" data-canvas><div class="gl" data-gl></div><div class="vig"></div><div class="lab" data-lab></div><div class="stmt" data-stmt></div></div>
<div class="msg" data-msg>Loading 3D scene…</div>
<div class="hint" data-hint hidden>CLICK OR SWIPE TO STEP THROUGH →</div>
<div class="fscap"><span class="k">Step <span data-no>--</span> / <span data-total>--</span> · <span data-label></span></span><span class="c" data-cue></span></div>
</div>
<div class="leg">${leg}<span class="keys">← → keys · click or swipe the scene</span></div>
<div class="segs" data-segs></div>
<div class="bot"><div class="cue" aria-live="polite"><span class="eyebrow">Step <span data-no>--</span> · <span data-label>Loading</span></span><p data-cue>Loading the scene…</p></div>
<div class="ctl"><button class="bk" type="button" aria-label="Previous step" data-back>←</button><button class="nx" type="button" data-next>Next step →</button></div></div>
</div>`;
}

// Static figure icons
const hex = (c = '') => `<span class="hex${c ? ' ' + c : ''}" aria-hidden="true"></span>`;
const share = (c = '') => `<span class="shr${c ? ' ' + c : ''}" aria-hidden="true"></span>`;

module.exports = { video, link, proposalBtn, proposalCard, cap, stepper, hex, share };
