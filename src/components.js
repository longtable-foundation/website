const cfg = require('./config');
const { esc, ext } = require('./layout');

// Video thumbnail. With a YouTube id it links out (or click-to-play embeds when embed:true);
// without one it shows a "coming soon" placeholder.
function video({ id, label, dur, durLeft, small, start, embed }) {
  const cls = 'vid' + (small ? ' sm' : '') + (embed && id ? ' embed' : '');
  const durHtml = dur ? `<span class="dur${durLeft ? ' l' : ''}"${durLeft ? ' data-chap-badge' : ''}>${esc(dur)}</span>` : '';
  if (id && embed) {
    const s = start ? Number(start) : 0;
    return `<div class="${cls} has-img" data-yt-embed="${esc(id)}" data-start="${s}" role="button" tabindex="0" aria-label="Play ${esc(label)}"><img src="https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg" alt="" loading="lazy"><span class="play" aria-hidden="true"></span>${durHtml}<span class="lbl">${esc(label)}</span></div>`;
  }
  if (id) {
    const href = `https://www.youtube.com/watch?v=${encodeURIComponent(id)}${start ? `&t=${start}s` : ''}`;
    return `<a class="${cls} has-img" ${ext(href)} data-yt="${esc(id)}" aria-label="${esc(label)} (opens YouTube)"><img src="https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg" alt="" loading="lazy"><span class="play" aria-hidden="true"></span>${durHtml}</a>`;
  }
  return `<div class="${cls} soon" role="img" aria-label="${esc(label)}: video coming soon"><span class="lbl">${esc(label)} · Video coming soon</span><span class="play" aria-hidden="true"></span>${durHtml}</div>`;
}

const link = (href, inner, cls = 'u') => (href ? `<a class="${cls}" ${ext(href)}>${inner}</a>` : `<span class="${cls}" style="opacity:.5" title="Link coming soon">${inner}</span>`);

const proposalBtn = (label = 'Get the proposal') =>
  `<a class="btn" href="${esc(cfg.proposal.href)}" data-proposal>${label} <span class="meta">PDF · ${cfg.proposal.pages} pp · by email</span></a>`;

const proposalCard = () => `<a class="pdfcard" href="${esc(cfg.proposal.href)}" data-proposal>
<span class="eyebrow">LT-0001 · External proposal</span>
<b>${esc(cfg.proposal.title)}</b>
<span class="ft"><span>PDF · ${cfg.proposal.pages} pages · ${esc(cfg.proposal.date)}</span><span>Get it by email →</span></span>
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

// One form: work email + organization. On success the form hides and the done pane shows.
const hp = '<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">';
const formBox = ({ type, id, title, desc, button, note, doneTitle, doneText }) => `<div class="pform" data-box>
<form class="pane" id="${id}" data-form="${type}" novalidate>${hp}
<span class="tt"${id ? ` id="${id}-t"` : ''}>${title}</span><span class="ds">${desc}</span>
<div class="g2"><label><span>WORK EMAIL</span><input class="field" type="email" name="email" required placeholder="name@organization.com" autocomplete="email"></label><label><span>ORGANIZATION</span><input class="field" name="organization" required autocomplete="organization"></label></div>
<button class="btn" type="submit">${button}</button><span class="note err" data-err role="alert" hidden></span><span class="note" data-msg>${note}</span>
</form>
<div class="done" data-done hidden tabindex="-1"><span class="ok" aria-hidden="true">✓</span><span class="tt">${doneTitle}</span><span class="ds">${doneText}</span><button class="btn-sm" type="button" data-reset>Back to the form</button></div>
</div>`;

// Inline Follow form for the homepage: the site's primary action. Same sign-up type as Get involved.
const followForm = ({ id, title }) => `<div class="follow" data-box>
<form id="${id}" data-form="signup" novalidate aria-labelledby="${id}-t">${hp}
<span class="tt" id="${id}-t">${title}</span>
<div class="fr"><label><span>Work email</span><input class="field" type="email" name="email" required placeholder="name@organization.com" autocomplete="email"></label><label><span>Organization</span><input class="field" name="organization" required autocomplete="organization"></label><button class="btn" type="submit">Follow progress</button></div>
<span class="note err" data-err role="alert" hidden></span><span class="note" data-msg>Milestones, publications and open calls for comment. Unsubscribe any time.</span>
</form>
<div class="done" data-done hidden tabindex="-1"><span class="ok" aria-hidden="true">✓</span><span class="tt">You’re following Longtable</span><span class="ds">Updates will go to <b data-done-email></b>.</span><button class="btn-sm" type="button" data-reset>Use another email</button></div>
</div>`;

const proposalForm = (id = 'proposal-form') => formBox({
  type: 'proposal', id,
  title: 'Get the proposal',
  desc: `${esc(cfg.proposal.title)}. PDF, ${cfg.proposal.pages} pages, ${esc(cfg.proposal.date)}. Leave your work email and organization and we will email it to you.`,
  button: 'Email me the proposal',
  note: 'We will also send you progress updates. Unsubscribe any time.',
  doneTitle: 'Check your inbox',
  doneText: 'The proposal is on its way to <b data-done-email></b>. It can take a few minutes. Look in your spam folder if it does not arrive.',
});

const proposalDialog = () => `<dialog class="pdlg" id="proposal-dialog" aria-labelledby="proposal-dialog-form-t">
<button class="x" type="button" data-close aria-label="Close">✕</button>
${proposalForm('proposal-dialog-form')}
</dialog>`;

module.exports = { formBox, followForm, proposalForm, proposalDialog, video, link, proposalBtn, proposalCard, cap, stepper, hex, share };
